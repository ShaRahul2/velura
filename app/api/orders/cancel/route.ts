import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { emailsMatch, toPublicOrder } from '@/lib/orderPublic'
import { applyOrderAction, customerCanCancel } from '@/lib/orderActions'
import { notifyOrder } from '@/lib/orderMail'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

const Body = z.object({
  orderId: z.string().min(6).max(80),
  email: z.string().email(),
})

const NOT_FOUND = 'We could not find that order.'

export async function POST(req: NextRequest) {
  if (!await checkRateLimit(`order-cancel:${clientIp(req)}`, 8)) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })
  }

  try {
    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 })
    }

    const current = await db.order.findUnique({
      where: { id: parsed.data.orderId.trim() },
      include: { items: true },
    })
    if (!current || !emailsMatch(current.email, parsed.data.email)) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 })
    }
    if (!customerCanCancel(current.status)) {
      return NextResponse.json(
        { error: 'This order can no longer be cancelled. Write to the atelier.' },
        { status: 422 },
      )
    }

    await applyOrderAction(current.id, 'cancel')
    void notifyOrder(current.id, 'cancelled')

    const order = await db.order.findUnique({
      where: { id: current.id },
      include: { items: true, shipment: { include: { events: true } } },
    })
    if (!order) return NextResponse.json({ error: NOT_FOUND }, { status: 404 })

    return NextResponse.json({ data: toPublicOrder(order) })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not cancel the order.'
    console.error('[orders/cancel]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
