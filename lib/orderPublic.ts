import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { customerCanCancel } from '@/lib/orderActionPolicy'

export type PublicOrder = {
  id: string
  createdAt: string
  fulfilment: string
  fulfilmentKey: OrderStatus
  payment: string
  paymentKey: PaymentStatus
  method: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  items: Array<{ name: string; size: string; qty: number; price: number; custom: boolean }>
  shipTo: {
    name: string
    addressLine: string
    city: string
    state: string
    pinCode: string
  }
  note: string
  canCancel: boolean
  carrier: string | null
  trackingNumber: string | null
}

const FULFILMENT: Record<OrderStatus, string> = {
  pending: 'Received',
  confirmed: 'Confirmed',
  shipped: 'On its way',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
}

const METHOD: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net banking',
  cod: 'Cash on delivery',
}

export function paymentLabel(method: PaymentMethod, status: PaymentStatus): string {
  if (method === 'cod' && (status === 'pending' || status === 'unpaid')) return 'Due on delivery'
  if (status === 'paid') return 'Paid'
  if (status === 'failed') return 'Payment failed'
  if (status === 'refunded') return 'Refunded'
  if (status === 'pending') return 'Payment in progress'
  return 'Awaiting payment'
}

export function deliveryNote(order: {
  status: OrderStatus
  paymentStatus: PaymentStatus
  items: Array<{ productId: number | null }>
  carrier?: string | null
  trackingNumber?: string | null
}): string {
  if (order.status === 'returned') {
    return order.paymentStatus === 'refunded'
      ? 'Returned. Refund issued to the original method.'
      : 'Returned.'
  }
  if (order.status === 'cancelled') {
    return order.paymentStatus === 'refunded'
      ? 'Cancelled. Refund issued to the original method.'
      : 'This order was cancelled.'
  }
  if (order.status === 'delivered') return 'It arrived.'
  if (order.status === 'shipped') {
    if (order.trackingNumber) {
      return `It has left us${order.carrier ? ` with ${order.carrier}` : ''}. Tracking ${order.trackingNumber}.`
    }
    return 'It has left us.'
  }
  const custom = order.items.some((item) => item.productId === null)
  return custom
    ? 'Custom pieces: 7–10 business days after confirmation.'
    : '3–5 business days after confirmation.'
}

export function toPublicOrder(
  order: Order & { items: OrderItem[] },
): PublicOrder {
  return {
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    fulfilment: FULFILMENT[order.status],
    fulfilmentKey: order.status,
    payment: paymentLabel(order.paymentMethod, order.paymentStatus),
    paymentKey: order.paymentStatus,
    method: METHOD[order.paymentMethod],
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    items: order.items.map((item) => ({
      name: item.name,
      size: item.size,
      qty: item.qty,
      price: item.priceAtOrder,
      custom: item.productId === null,
    })),
    shipTo: {
      name: `${order.firstName} ${order.lastName}`.trim(),
      addressLine: order.addressLine,
      city: order.city,
      state: order.state,
      pinCode: order.pinCode,
    },
    note: deliveryNote(order),
    canCancel: customerCanCancel(order.status),
    carrier: order.carrier,
    trackingNumber: order.trackingNumber,
  }
}

export function emailsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatOrderMoney(amount: number): string {
  return formatPrice(amount)
}

const LAST_ORDER_KEY = 'velura-last-order'

export function rememberLastOrder(id: string, email: string): void {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ id, email }))
  } catch {
    /* private mode */
  }
}

export function readLastOrder(): { id: string; email: string } | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { id?: unknown; email?: unknown }
    if (typeof parsed.id !== 'string' || typeof parsed.email !== 'string') return null
    return { id: parsed.id, email: parsed.email }
  } catch {
    return null
  }
}
