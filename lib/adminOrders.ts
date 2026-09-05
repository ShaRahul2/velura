import type { OrderStatus, PaymentStatus } from '@prisma/client'

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}

export const ORDER_LABEL: Record<OrderStatus, string> = {
  pending: 'Received',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUSES = Object.keys(ORDER_LABEL) as OrderStatus[]

export function adminTone(status: string) {
  if (status === 'paid' || status === 'delivered' || status === 'confirmed' || status === 'shipped') {
    return 'text-[#EDE9E4]'
  }
  if (status === 'failed' || status === 'cancelled') {
    return 'text-[#C4A090]'
  }
  return 'text-[rgba(237,233,228,0.55)]'
}

export function formatAdminDate(value: Date | null | undefined) {
  if (!value) return '—'
  return value.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
