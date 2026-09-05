import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { summarizeRazorpayPayment, verifyRazorpayWebhook } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  if (!verifyRazorpayWebhook(raw, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  let event: {
    event?: string
    payload?: {
      payment?: { entity?: Record<string, unknown> }
      refund?: { entity?: Record<string, unknown> }
    }
  }
  try {
    event = JSON.parse(raw) as typeof event
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const refundEntity = event.payload?.refund?.entity
  if (event.event?.startsWith('refund.') && refundEntity && typeof refundEntity.payment_id === 'string') {
    const order = await db.order.findFirst({
      where: { razorpayPaymentId: refundEntity.payment_id },
    })
    if (order) {
      const current =
        order.paymentDetails && typeof order.paymentDetails === 'object' && !Array.isArray(order.paymentDetails)
          ? (order.paymentDetails as Record<string, unknown>)
          : {}
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'refunded',
          paymentDetails: {
            ...current,
            refundId: typeof refundEntity.id === 'string' ? refundEntity.id : current.refundId,
            refundStatus: typeof refundEntity.status === 'string' ? refundEntity.status : 'processed',
            refundedAt: new Date().toISOString(),
          } as Prisma.InputJsonValue,
        },
      })
    }
    return NextResponse.json({ data: { ok: true } })
  }

  const entity = event.payload?.payment?.entity
  if (!entity || typeof entity.id !== 'string') {
    return NextResponse.json({ data: { ignored: true } })
  }

  const notes = entity.notes as { veluraOrderId?: string } | undefined
  const razorpayOrderId = typeof entity.order_id === 'string' ? entity.order_id : undefined
  const order = notes?.veluraOrderId
    ? await db.order.findUnique({ where: { id: notes.veluraOrderId } })
    : razorpayOrderId
      ? await db.order.findFirst({ where: { razorpayOrderId } })
      : null

  if (!order) {
    return NextResponse.json({ data: { ignored: true } })
  }

  const details = summarizeRazorpayPayment({
    id: entity.id,
    order_id: razorpayOrderId,
    status: typeof entity.status === 'string' ? entity.status : undefined,
    method: typeof entity.method === 'string' ? entity.method : undefined,
    amount: typeof entity.amount === 'number' ? entity.amount : undefined,
    currency: typeof entity.currency === 'string' ? entity.currency : undefined,
    email: typeof entity.email === 'string' ? entity.email : undefined,
    contact: typeof entity.contact === 'string' ? entity.contact : undefined,
    vpa: typeof entity.vpa === 'string' ? entity.vpa : undefined,
    bank: typeof entity.bank === 'string' ? entity.bank : undefined,
    wallet: typeof entity.wallet === 'string' ? entity.wallet : undefined,
    card: entity.card as { last4?: string; network?: string } | null,
  }) as unknown as Prisma.InputJsonValue

  if (event.event === 'payment.captured' || entity.status === 'captured') {
    await db.order.update({
      where: { id: order.id },
      data: {
        status:            'confirmed',
        paymentStatus:     'paid',
        paidAt:            new Date(),
        razorpayPaymentId: entity.id,
        razorpayOrderId:   razorpayOrderId ?? order.razorpayOrderId,
        paymentDetails:    details,
      },
    })
    const { notifyOrder } = await import('@/lib/orderMail')
    void notifyOrder(order.id, 'placed')
  } else if (event.event === 'payment.failed' || entity.status === 'failed') {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus:     'failed',
        razorpayPaymentId: entity.id,
        paymentDetails:    details,
      },
    })
  }

  return NextResponse.json({ data: { ok: true } })
}
