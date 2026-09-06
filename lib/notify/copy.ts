import type { Order, OrderItem, Shipment } from '@prisma/client'
import { siteUrl } from '@/lib/site'
import { formatPrice } from '@/lib/utils'

export type OrderEventKind =
  | 'placed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type OrderWithItems = Order & { items: OrderItem[]; shipment?: Shipment | null }

export function orderLookupUrl(orderId: string): string {
  return `${siteUrl()}/order?id=${encodeURIComponent(orderId)}`
}

function itemLines(order: OrderWithItems): string {
  return order.items
    .map((it) => `${it.qty} × ${it.name} · ${it.size} — ${formatPrice(it.priceAtOrder * it.qty)}`)
    .join('\n')
}

function trackingLine(order: OrderWithItems): string {
  const awb = order.shipment?.awb ?? order.trackingNumber
  const courier = order.shipment?.courier ?? order.carrier
  if (!awb) return ''
  const url = order.shipment?.trackingUrl
  return `\nCourier: ${courier ?? '—'}\nTracking: ${awb}${url ? `\n${url}` : ''}`
}

export interface BuiltMessage {
  emailSubject: string
  emailText: string
  /** WhatsApp template body params, in order. Used when a template is configured. */
  whatsappParams: string[]
  /** Fallback plain-text WhatsApp body (only delivered inside a 24h session). */
  whatsappText: string
}

/** Editorial voice — spare, confident. No exclamation marks. */
export function buildMessage(kind: OrderEventKind, order: OrderWithItems): BuiltMessage {
  const name = order.firstName
  const total = formatPrice(order.total)
  const link = orderLookupUrl(order.id)
  const track = trackingLine(order)
  const refunded = order.paymentStatus === 'refunded'

  switch (kind) {
    case 'placed':
      return {
        emailSubject: `VELURA ${order.id}`,
        emailText: `${name},\n\nWe have ${order.id}. ${total}.\n\n${itemLines(order)}\n\nFollow it here: ${link}\n`,
        whatsappParams: [name, order.id, total],
        whatsappText: `${name}, we have your VELURA order ${order.id} (${total}). Follow it: ${link}`,
      }
    case 'shipped':
      return {
        emailSubject: `VELURA ${order.id} has left us`,
        emailText: `${name},\n\n${order.id} is on its way.${track}\n\n${link}\n`,
        whatsappParams: [name, order.id, order.shipment?.awb ?? order.trackingNumber ?? '—'],
        whatsappText: `${name}, VELURA ${order.id} has shipped.${track ? track.trim() : ''} ${link}`,
      }
    case 'out_for_delivery':
      return {
        emailSubject: `VELURA ${order.id} is out for delivery`,
        emailText: `${name},\n\n${order.id} is out for delivery today.${track}\n\n${link}\n`,
        whatsappParams: [name, order.id],
        whatsappText: `${name}, VELURA ${order.id} is out for delivery today. ${link}`,
      }
    case 'delivered':
      return {
        emailSubject: `VELURA ${order.id} delivered`,
        emailText: `${name},\n\n${order.id} has been delivered. Worn once. Remembered forever.\n\n${link}\n`,
        whatsappParams: [name, order.id],
        whatsappText: `${name}, VELURA ${order.id} has been delivered. ${link}`,
      }
    case 'returned':
      return {
        emailSubject: `VELURA ${order.id} returned`,
        emailText: `${name},\n\n${order.id} is marked returned.${refunded ? ' A refund is on the original method.' : ''}\n\n${link}\n`,
        whatsappParams: [name, order.id],
        whatsappText: `${name}, VELURA ${order.id} is marked returned.${refunded ? ' Refund on the original method.' : ''} ${link}`,
      }
    case 'cancelled':
    default:
      return {
        emailSubject: `VELURA ${order.id} cancelled`,
        emailText: `${name},\n\n${order.id} is cancelled.${refunded ? ' A refund is on the original method.' : ''}\n\n${link}\n`,
        whatsappParams: [name, order.id],
        whatsappText: `${name}, VELURA ${order.id} is cancelled.${refunded ? ' Refund on the original method.' : ''} ${link}`,
      }
  }
}
