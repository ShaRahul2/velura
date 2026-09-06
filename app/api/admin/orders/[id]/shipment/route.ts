import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { staffUnauthorized } from '@/lib/staffAuth'
import {
  ShipmentError,
  cancelShipmentForOrder,
  createShipmentForOrder,
  syncShipmentTracking,
} from '@/lib/shipping'
import { db } from '@/lib/db'

interface Context {
  params: Promise<{ id: string }>
}

const CreateBody = z.object({
  action: z.literal('create').optional(),
  weightKg: z.number().positive().max(30).optional(),
  courierId: z.number().int().positive().optional(),
  manualAwb: z.string().trim().max(80).optional(),
  manualCourier: z.string().trim().max(80).optional(),
})

const ActionBody = z.object({
  action: z.enum(['sync', 'cancel']),
})

function errStatus(err: unknown): number {
  return err instanceof ShipmentError ? err.status : 500
}

export async function POST(req: NextRequest, { params }: Context) {
  const denied = await staffUnauthorized()
  if (denied) return denied

  const { id } = await params
  const raw = await req.json().catch(() => ({}))

  try {
    if (raw?.action === 'sync' || raw?.action === 'cancel') {
      const { action } = ActionBody.parse(raw)
      const shipment = await db.shipment.findUnique({ where: { orderId: id }, select: { id: true } })
      if (!shipment) return NextResponse.json({ error: 'No shipment on this order.' }, { status: 404 })

      if (action === 'sync') {
        const updated = await syncShipmentTracking(shipment.id)
        revalidatePath(`/admin/orders/${id}`)
        return NextResponse.json({ data: { status: updated.status } })
      }
      await cancelShipmentForOrder(id)
      revalidatePath(`/admin/orders/${id}`)
      revalidatePath('/admin/orders')
      return NextResponse.json({ data: { cancelled: true } })
    }

    const body = CreateBody.parse(raw)
    const shipment = await createShipmentForOrder(id, {
      weightKg: body.weightKg,
      courierId: body.courierId,
      manualAwb: body.manualAwb,
      manualCourier: body.manualCourier,
    })
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/admin/orders')
    return NextResponse.json(
      {
        data: {
          id: shipment.id,
          status: shipment.status,
          awb: shipment.awb,
          courier: shipment.courier,
          labelUrl: shipment.labelUrl,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Could not update shipment'
    if (errStatus(err) === 500) console.error('[admin shipment]', err)
    return NextResponse.json({ error: message }, { status: errStatus(err) })
  }
}
