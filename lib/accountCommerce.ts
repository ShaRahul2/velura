import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import type { CartItem } from '@/types'
import { cartItemFromRow, lineKey, snapshotFromCartItem, variantFromCartItem } from '@/lib/cartLine'
import { mergeCartItems, mergeWishlistIds } from '@/lib/accountMerge'

function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

export async function getOrCreateCart(profileId: string) {
  return db.cart.upsert({
    where: { profileId },
    create: { profileId },
    update: {},
    include: { items: true },
  })
}

export async function cartItemsForProfile(profileId: string): Promise<CartItem[]> {
  const cart = await db.cart.findUnique({
    where: { profileId },
    include: { items: { orderBy: { createdAt: 'asc' } } },
  })
  if (!cart) return []
  return cart.items.map(cartItemFromRow)
}

export async function replaceCart(profileId: string, items: CartItem[]) {
  const cart = await getOrCreateCart(profileId)
  await db.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
    if (items.length === 0) {
      await tx.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } })
      return
    }
    await tx.cartItem.createMany({
      data: items.map((item) => ({
        cartId: cart.id,
        productId: item.isCustom ? null : item.id,
        variant: asJson(variantFromCartItem(item)),
        variantKey: lineKey(item),
        quantity: Math.min(10, Math.max(1, item.qty)),
        snapshot: asJson(snapshotFromCartItem(item)),
      })),
    })
    await tx.cart.update({ where: { id: cart.id }, data: { updatedAt: new Date() } })
  })
  return cartItemsForProfile(profileId)
}

export async function mergeGuestCart(profileId: string, guest: CartItem[]) {
  const server = await cartItemsForProfile(profileId)
  if (guest.length === 0) return server
  return replaceCart(profileId, mergeCartItems(server, guest))
}

export async function clearCart(profileId: string) {
  return replaceCart(profileId, [])
}

export async function wishlistIdsForProfile(profileId: string) {
  const rows = await db.wishlistItem.findMany({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
    select: { productId: true },
  })
  return rows.map((row) => row.productId)
}

export async function replaceWishlist(profileId: string, productIds: number[]) {
  const unique = [...new Set(productIds.filter((id) => Number.isInteger(id) && id > 0))]
  await db.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({ where: { profileId } })
    if (unique.length === 0) return
    await tx.wishlistItem.createMany({
      data: unique.map((productId) => ({ profileId, productId })),
    })
  })
  return unique
}

export async function mergeGuestWishlist(profileId: string, guestIds: number[]) {
  const server = await wishlistIdsForProfile(profileId)
  return replaceWishlist(profileId, mergeWishlistIds(server, guestIds))
}

export async function toggleWishlist(profileId: string, productId: number) {
  const existing = await db.wishlistItem.findUnique({
    where: { profileId_productId: { profileId, productId } },
  })
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } })
    return { wishlisted: false as const, ids: await wishlistIdsForProfile(profileId) }
  }
  await db.wishlistItem.create({ data: { profileId, productId } })
  return { wishlisted: true as const, ids: await wishlistIdsForProfile(profileId) }
}
