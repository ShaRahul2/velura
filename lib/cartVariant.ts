import type { BuilderState, CartItem } from '@/types'

export type CartVariant = {
  size: string
  color?: string
  colorLabel?: string
  isCustom?: boolean
  customSpec?: BuilderState
  customGrad?: string
}

export type CartSnapshot = {
  name: string
  price: number
  emoji: string
  images: string[]
  colorLabel?: string
  customGrad?: string
}

export function cartVariantKey(item: Pick<CartItem, 'size' | 'color' | 'isCustom' | 'customSpec'>): string {
  const spec = item.customSpec ? JSON.stringify(item.customSpec) : ''
  return `${item.size}|${item.color ?? ''}|${item.isCustom ? 'c' : 'r'}|${spec}`
}

export function toCartVariant(item: CartItem): CartVariant {
  return {
    size: item.size,
    ...(item.color ? { color: item.color } : {}),
    ...(item.colorLabel ? { colorLabel: item.colorLabel } : {}),
    ...(item.isCustom ? { isCustom: true } : {}),
    ...(item.customSpec ? { customSpec: item.customSpec } : {}),
    ...(item.customGrad ? { customGrad: item.customGrad } : {}),
  }
}

export function toCartSnapshot(item: CartItem): CartSnapshot {
  return {
    name: item.name,
    price: item.price,
    emoji: item.emoji,
    images: item.images,
    ...(item.colorLabel ? { colorLabel: item.colorLabel } : {}),
    ...(item.customGrad ? { customGrad: item.customGrad } : {}),
  }
}

export function cartItemFromLine(line: {
  productId: number
  quantity: number
  variant: CartVariant
  snapshot: CartSnapshot
}): CartItem {
  return {
    id: line.productId,
    name: line.snapshot.name,
    price: line.snapshot.price,
    qty: line.quantity,
    size: line.variant.size,
    emoji: line.snapshot.emoji,
    images: line.snapshot.images,
    ...(line.variant.color ? { color: line.variant.color } : {}),
    ...(line.variant.colorLabel ?? line.snapshot.colorLabel
      ? { colorLabel: line.variant.colorLabel ?? line.snapshot.colorLabel }
      : {}),
    ...(line.variant.isCustom ? { isCustom: true } : {}),
    ...(line.variant.customSpec ? { customSpec: line.variant.customSpec } : {}),
    ...(line.variant.customGrad ?? line.snapshot.customGrad
      ? { customGrad: line.variant.customGrad ?? line.snapshot.customGrad }
      : {}),
  }
}

export function mergeCartItems(server: CartItem[], guest: CartItem[]): CartItem[] {
  const merged = [...server]
  for (const item of guest) {
    const key = cartVariantKey(item)
    const index = merged.findIndex(
      (existing) => existing.id === item.id && cartVariantKey(existing) === key,
    )
    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        qty: Math.min(20, merged[index].qty + item.qty),
      }
    } else {
      merged.push(item)
    }
  }
  return merged
}
