import { db } from '@/lib/db'
import { buildMessage, type OrderEventKind } from './copy'
import { sendEmail } from './email'
import { sendWhatsapp } from './whatsapp'

export type { OrderEventKind } from './copy'
export { isEmailConfigured } from './email'
export { isWhatsappConfigured } from './whatsapp'

/**
 * Send the customer the notification for an order lifecycle event across every
 * configured channel (email + WhatsApp). Best-effort: a channel failure never
 * throws. `placed` is de-duplicated on Order.placedNotifiedAt; the shipping
 * milestones are de-duplicated by the caller (Shipment.notified* stamps).
 */
export async function notifyOrder(orderId: string, kind: OrderEventKind): Promise<void> {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true, shipment: true },
    })
    if (!order) return

    if (kind === 'placed') {
      if (order.placedNotifiedAt) return
      await db.order.update({ where: { id: orderId }, data: { placedNotifiedAt: new Date() } })
    }

    const msg = buildMessage(kind, order)
    await Promise.allSettled([
      order.email ? sendEmail(order.email, msg.emailSubject, msg.emailText) : Promise.resolve(),
      order.phone ? sendWhatsapp(order.phone, kind, msg.whatsappParams) : Promise.resolve(),
    ])
  } catch (err) {
    console.error('[notify]', kind, orderId, err)
  }
}
