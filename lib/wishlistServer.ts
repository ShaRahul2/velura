import { db } from '@/lib/db'

export async function listWishlistIds(profileId: string): Promise<number[]> {
  const rows = await db.wishlistItem.findMany({
    where: { profileId },
    orderBy: { createdAt: 'desc' },
    select: { productId: true },
  })
  return rows.map((row) => row.productId)
}

export async function toggleWishlist(profileId: string, productId: number): Promise<{ ids: number[]; saved: boolean }> {
  const existing = await db.wishlistItem.findUnique({
    where: { profileId_productId: { profileId, productId } },
  })
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } })
    return { ids: await listWishlistIds(profileId), saved: false }
  }
  await db.wishlistItem.create({ data: { profileId, productId } })
  return { ids: await listWishlistIds(profileId), saved: true }
}

export async function mergeGuestWishlist(profileId: string, guestIds: number[]): Promise<number[]> {
  const unique = [...new Set(guestIds.filter((id) => Number.isInteger(id) && id > 0))]
  if (unique.length > 0) {
    await db.wishlistItem.createMany({
      data: unique.map((productId) => ({ profileId, productId })),
      skipDuplicates: true,
    })
  }
  return listWishlistIds(profileId)
}

export async function replaceWishlist(profileId: string, ids: number[]): Promise<number[]> {
  const unique = [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))]
  await db.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({ where: { profileId } })
    if (unique.length === 0) return
    await tx.wishlistItem.createMany({
      data: unique.map((productId) => ({ profileId, productId })),
    })
  })
  return unique
}
