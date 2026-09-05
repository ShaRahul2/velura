import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { staffUnauthorized } from '@/lib/staffAuth'
import { revalidatePath } from 'next/cache'
import { applyOrderAction } from '@/lib/orderActions'
import { notifyOrder } from '@/lib/orderMail'
import { db } from '@/lib/db'

interface Context {
  params: Promise<{ id: string }>
}

const Body = z.object({
  action: z.enum(['confirm', 'ship', 'deliver', 'collect', 'cancel', 'return', 'refund']).optional(),
  carrier: z.string().max(80).optional(),
  trackingNumber: z.string().max(80).optional(),
})

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const denied = await staffUnauthorized()
    if (denied) return denied

    const { id } = await params
    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!parsed.data.action) {
      const order = await db.order.update({
        where: { id },
        data: {
          ...(parsed.data.carrier !== undefined && { carrier: parsed.data.carrier.trim() || null }),
          ...(parsed.data.trackingNumber !== undefined && {
            trackingNumber: parsed.data.trackingNumber.trim() || null,
          }),
        },
      })
      revalidatePath('/admin/orders')
      revalidatePath(`/admin/orders/${id}`)
      return NextResponse.json({
        data: { id: order.id, carrier: order.carrier, trackingNumber: order.trackingNumber },
      })
    }

    const order = await applyOrderAction(id, parsed.data.action, {
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    if (parsed.data.action === 'ship') void notifyOrder(id, 'shipped')
    if (parsed.data.action === 'cancel') void notifyOrder(id, 'cancelled')
    if (parsed.data.action === 'return') void notifyOrder(id, 'returned')
    if (parsed.data.action === 'refund') void notifyOrder(id, 'cancelled')

    return NextResponse.json({
      data: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not update order'
    console.error('[PATCH /api/admin/orders/[id]]', err)
    const status = message === 'Order not found' ? 404 : message.includes('not available') ? 422 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
