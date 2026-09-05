import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { emailsMatch, toPublicOrder } from '@/lib/orderPublic'

const Body = z.object({
  orderId: z.string().min(6).max(80),
  email: z.string().email(),
})

const NOT_FOUND = 'We could not find that order.'

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 })
    }

    const order = await db.order.findUnique({
      where: { id: parsed.data.orderId.trim() },
      include: { items: true },
    })

    if (!order || !emailsMatch(order.email, parsed.data.email)) {
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json({ data: toPublicOrder(order) })
  } catch (err) {
    console.error('[orders/lookup]', err)
    return NextResponse.json({ error: 'Could not look up the order.' }, { status: 500 })
  }
}
