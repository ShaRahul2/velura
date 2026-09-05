import type { BuilderState, CartItem } from '@/types'

export type CartVariant = {
  size: string
  color?: string
  colorLabel?: string
  isCustom?: boolean
  customSpec?: BuilderState | null
}

export function lineKey(item: Pick<CartItem, 'id' | 'size' | 'color' | 'isCustom' | 'customSpec'>) {
  if (item.isCustom) {
    return `custom::${item.size}::${stableJson(item.customSpec ?? null)}`
  }
  return `${item.id}::${item.size}::${item.color ?? ''}`
}

export function variantFromCartItem(item: CartItem): CartVariant {
  return {
    size: item.size,
    ...(item.color ? { color: item.color } : {}),
    ...(item.colorLabel ? { colorLabel: item.colorLabel } : {}),
    ...(item.isCustom ? { isCustom: true, customSpec: item.customSpec ?? null } : {}),
  }
}

export function snapshotFromCartItem(item: CartItem) {
  return {
    name: item.name,
    price: item.price,
    emoji: item.emoji,
    images: item.images,
    ...(item.customGrad ? { customGrad: item.customGrad } : {}),
  }
}

export function cartItemFromRow(row: {
  productId: number | null
  quantity: number
  variant: unknown
  snapshot: unknown
}): CartItem {
  const variant = asRecord(row.variant)
  const snapshot = asRecord(row.snapshot)
  const customSpec = variant.customSpec && typeof variant.customSpec === 'object'
    ? (variant.customSpec as BuilderState)
    : undefined
  return {
    id: row.productId ?? 0,
    name: str(snapshot.name, 'Piece'),
    price: num(snapshot.price, 0),
    qty: row.quantity,
    size: str(variant.size, ''),
    emoji: str(snapshot.emoji, ''),
    images: Array.isArray(snapshot.images)
      ? snapshot.images.filter((u): u is string => typeof u === 'string')
      : [],
    ...(typeof variant.color === 'string' ? { color: variant.color } : {}),
    ...(typeof variant.colorLabel === 'string' ? { colorLabel: variant.colorLabel } : {}),
    ...(variant.isCustom === true
      ? { isCustom: true, customSpec, customGrad: str(snapshot.customGrad, undefined) }
      : {}),
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function str(value: unknown, fallback: string): string
function str(value: unknown, fallback: undefined): string | undefined
function str(value: unknown, fallback: string | undefined) {
  return typeof value === 'string' ? value : fallback
}

function num(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stableJson(value: unknown) {
  if (value == null || typeof value !== 'object') return JSON.stringify(value)
  const rec = value as Record<string, unknown>
  const keys = Object.keys(rec).sort()
  const ordered: Record<string, unknown> = {}
  for (const key of keys) ordered[key] = rec[key]
  return JSON.stringify(ordered)
}
