import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { getRazorpay, summarizeRazorpayPayment, verifyRazorpaySignature } from '@/lib/razorpay'

const Body = z.object({
  orderId:              z.string().min(1),
  razorpay_order_id:    z.string().min(1),
  razorpay_payment_id:  z.string().min(1),
  razorpay_signature:   z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const ok = verifyRazorpaySignature({
      orderId:   parsed.data.razorpay_order_id,
      paymentId: parsed.data.razorpay_payment_id,
      signature: parsed.data.razorpay_signature,
    })
    if (!ok) {
      try {
        await db.order.update({
          where: { id: parsed.data.orderId },
          data:  { paymentStatus: 'failed' },
        })
      } catch {
        /* order may not exist */
      }
      return NextResponse.json({ error: 'Payment signature mismatch' }, { status: 400 })
    }

    let details: Prisma.InputJsonValue | undefined
    const razorpay = getRazorpay()
    if (razorpay) {
      try {
        const payment = await razorpay.payments.fetch(parsed.data.razorpay_payment_id)
        details = summarizeRazorpayPayment({
          id: payment.id,
          order_id: payment.order_id,
          status: payment.status,
          method: payment.method,
          amount: payment.amount,
          currency: payment.currency,
          email: payment.email ?? undefined,
          contact: payment.contact != null ? String(payment.contact) : undefined,
          vpa: payment.vpa,
          bank: payment.bank,
          wallet: payment.wallet,
          card: payment.card,
        }) as unknown as Prisma.InputJsonValue
      } catch (err) {
        console.error('[payments/verify] fetch payment', err)
      }
    }

    await db.order.update({
      where: { id: parsed.data.orderId },
      data: {
        status:             'confirmed',
        paymentStatus:      'paid',
        paidAt:             new Date(),
        razorpayOrderId:    parsed.data.razorpay_order_id,
        razorpayPaymentId:  parsed.data.razorpay_payment_id,
        razorpaySignature:  parsed.data.razorpay_signature,
        ...(details !== undefined && { paymentDetails: details }),
      },
    })

    return NextResponse.json({ data: { orderId: parsed.data.orderId, paid: true } })
  } catch {
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 })
  }
}
