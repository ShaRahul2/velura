import { db } from '@/lib/db'
import { toPublicOrder, type PublicOrder } from '@/lib/orderPublic'

export function assertOrderOwner(orderProfileId: string | null | undefined, userId: string): boolean {
  return Boolean(orderProfileId && orderProfileId === userId)
}

export async function listCustomerOrders(profileId: string): Promise<PublicOrder[]> {
  const orders = await db.order.findMany({
    where: { profileId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return orders.map(toPublicOrder)
}

export async function getCustomerOrder(profileId: string, orderId: string): Promise<PublicOrder | null> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order || !assertOrderOwner(order.profileId, profileId)) return null
  return toPublicOrder(order)
}
