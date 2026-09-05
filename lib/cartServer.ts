import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import type { CartItem } from '@/types'
import {
  cartItemFromLine,
  cartVariantKey,
  mergeCartItems,
  toCartSnapshot,
  toCartVariant,
  type CartSnapshot,
  type CartVariant,
} from '@/lib/cartVariant'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseVariant(value: unknown): CartVariant {
  if (!isRecord(value) || typeof value.size !== 'string') {
    return { size: '' }
  }
  return {
    size: value.size,
    ...(typeof value.color === 'string' ? { color: value.color } : {}),
    ...(typeof value.colorLabel === 'string' ? { colorLabel: value.colorLabel } : {}),
    ...(value.isCustom === true ? { isCustom: true } : {}),
    ...(isRecord(value.customSpec) ? { customSpec: value.customSpec as unknown as CartVariant['customSpec'] } : {}),
    ...(typeof value.customGrad === 'string' ? { customGrad: value.customGrad } : {}),
  }
}

function parseSnapshot(value: unknown): CartSnapshot {
  if (!isRecord(value) || typeof value.name !== 'string') {
    return { name: 'Piece', price: 0, emoji: '', images: [] }
  }
  return {
    name: value.name,
    price: typeof value.price === 'number' ? value.price : 0,
    emoji: typeof value.emoji === 'string' ? value.emoji : '',
    images: Array.isArray(value.images) ? value.images.filter((v): v is string => typeof v === 'string') : [],
    ...(typeof value.colorLabel === 'string' ? { colorLabel: value.colorLabel } : {}),
    ...(typeof value.customGrad === 'string' ? { customGrad: value.customGrad } : {}),
  }
}

async function ensureCart(profileId: string) {
  return db.cart.upsert({
    where: { profileId },
    create: { profileId },
    update: {},
    include: { items: true },
  })
}

export async function listCartItems(profileId: string): Promise<CartItem[]> {
  const cart = await ensureCart(profileId)
  return cart.items.map((line) =>
    cartItemFromLine({
      productId: line.productId,
      quantity: line.quantity,
      variant: parseVariant(line.variant),
      snapshot: parseSnapshot(line.snapshot),
    }),
  )
}

export async function replaceCart(profileId: string, items: CartItem[]): Promise<CartItem[]> {
  const cart = await ensureCart(profileId)
  await db.$transaction(async (tx) => {
    await tx.cartLine.deleteMany({ where: { cartId: cart.id } })
    if (items.length === 0) return
    await tx.cartLine.createMany({
      data: items.map((item) => ({
        cartId: cart.id,
        productId: item.id,
        variantKey: cartVariantKey(item),
        quantity: Math.max(1, Math.min(20, item.qty)),
        variant: JSON.parse(JSON.stringify(toCartVariant(item))) as Prisma.InputJsonValue,
        snapshot: JSON.parse(JSON.stringify(toCartSnapshot(item))) as Prisma.InputJsonValue,
      })),
    })
    await tx.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } })
  })
  return listCartItems(profileId)
}

export async function mergeGuestCart(profileId: string, guestItems: CartItem[]): Promise<CartItem[]> {
  const server = await listCartItems(profileId)
  return replaceCart(profileId, mergeCartItems(server, guestItems))
}

export async function clearCart(profileId: string): Promise<void> {
  await replaceCart(profileId, [])
}
