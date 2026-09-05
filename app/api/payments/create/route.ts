import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getRazorpay, isRazorpayConfigured, rupeesToPaise } from '@/lib/razorpay'

const Body = z.object({
  orderId: z.string().min(1).max(80),
})

export async function POST(req: NextRequest) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: 'Razorpay is not configured. Use Cash on Delivery, or add RAZORPAY keys.' },
        { status: 503 },
      )
    }

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const order = await db.order.findUnique({ where: { id: parsed.data.orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.paymentMethod === 'cod') {
      return NextResponse.json({ error: 'This order is Cash on Delivery' }, { status: 422 })
    }

    const razorpay = getRazorpay()
    if (!razorpay) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 503 })
    }

    const rzpOrder = await razorpay.orders.create({
      amount:   rupeesToPaise(order.total),
      currency: 'INR',
      receipt:  order.id.slice(0, 40),
      notes:    { veluraOrderId: order.id },
    })

    try {
      await db.order.update({
        where: { id: order.id },
        data:  { razorpayOrderId: rzpOrder.id, paymentStatus: 'pending' },
      })
    } catch {
      // Column may be missing until `prisma db push`
    }

    return NextResponse.json({
      data: {
        orderId:         order.id,
        razorpayOrderId: rzpOrder.id,
        amount:          rzpOrder.amount,
        currency:        rzpOrder.currency,
        key:             process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    })
  } catch (err) {
    console.error('[payments/create]', err)
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 })
  }
}
