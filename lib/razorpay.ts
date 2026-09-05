import Razorpay from 'razorpay'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { PAYMENT_PROVIDER } from '@/lib/payments'

export { PAYMENT_PROVIDER }
export { isOnlineMethod } from '@/lib/payments'

export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  )
}

export function getRazorpay(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) return null
  return new Razorpay({ key_id, key_secret })
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees) * 100
}

export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export type StoredPaymentDetails = {
  provider: 'razorpay'
  razorpayPaymentId: string
  razorpayOrderId: string
  status: string
  method?: string
  amountPaise?: number
  currency?: string
  email?: string
  contact?: string
  vpa?: string
  bank?: string
  wallet?: string
  cardLast4?: string
  cardNetwork?: string
}

export function summarizeRazorpayPayment(
  payment: {
    id: string
    order_id?: string | null
    status?: string
    method?: string
    amount?: number | string
    currency?: string
    email?: string | null
    contact?: string | number | null
    vpa?: string | null
    bank?: string | null
    wallet?: string | null
    card?: { last4?: string; network?: string } | null
  },
): StoredPaymentDetails {
  return {
    provider: 'razorpay',
    razorpayPaymentId: payment.id,
    razorpayOrderId: payment.order_id ?? '',
    status: payment.status ?? 'unknown',
    method: payment.method,
    amountPaise: typeof payment.amount === 'string' ? Number(payment.amount) : payment.amount,
    currency: payment.currency,
    email: payment.email ?? undefined,
    contact: payment.contact != null ? String(payment.contact) : undefined,
    vpa: payment.vpa ?? undefined,
    bank: payment.bank ?? undefined,
    wallet: payment.wallet ?? undefined,
    cardLast4: payment.card?.last4,
    cardNetwork: payment.card?.network,
  }
}

export function verifyRazorpaySignature(params: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false
  const expected = createHmac('sha256', secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(params.signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}


