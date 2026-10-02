import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applyTrackingUpdate } from '@/lib/shipping'
import { mapShiprocketStatus } from '@/lib/shipping/status'
import type { NormalizedEvent } from '@/lib/shipping/types'

export const dynamic = 'force-dynamic'

type Scan = {
  date?: string
  activity?: string
  status?: string
  location?: string
  'sr-status'?: string | number
  'sr-status-label'?: string
}

type Payload = {
  awb?: string | number
  order_id?: string
  sr_order_id?: string | number
  current_status?: string
  current_status_id?: number | string
  shipment_status?: string
  shipment_status_id?: number | string
  current_timestamp?: string
  etd?: string
  scans?: Scan[]
}

export async function POST(req: NextRequest) {
  const secret = process.env.SHIPROCKET_WEBHOOK_TOKEN
  const provided = req.headers.get('x-api-key') ?? req.headers.get('x-shiprocket-token') ?? ''
  if (secret && provided !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: Payload
  try {
    body = (await req.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }

  const awb = body.awb != null ? String(body.awb) : ''
  if (!awb) return NextResponse.json({ data: { ignored: 'no awb' } })

  const shipment = await db.shipment.findFirst({
    where: { awb },
    select: { id: true },
  })
  if (!shipment) return NextResponse.json({ data: { ignored: 'unknown awb' } })

  const now = body.current_timestamp ? new Date(body.current_timestamp) : new Date()
  const events: NormalizedEvent[] = (body.scans ?? [])
    .filter((s) => s.date)
    .map((s) => ({
      status: mapShiprocketStatus(s['sr-status'], s['sr-status-label'] || s.status || s.activity),
      code: s['sr-status'] != null ? String(s['sr-status']) : undefined,
      description: s.activity || s.status || 'Update',
      location: s.location || undefined,
      occurredAt: new Date(s.date as string),
      raw: s,
    }))

  // Always fold in the top-level status as an event too — some webhooks omit scans
  const headStatus = mapShiprocketStatus(
    body.shipment_status_id ?? body.current_status_id,
    body.shipment_status || body.current_status,
  )
  events.push({
    status: headStatus,
    code:
      body.shipment_status_id != null
        ? String(body.shipment_status_id)
        : body.current_status_id != null
          ? String(body.current_status_id)
          : undefined,
    description: body.shipment_status || body.current_status || 'Status update',
    occurredAt: now,
    raw: { top: true },
  })

  try {
    await applyTrackingUpdate(shipment.id, events, {
      estimatedDelivery: body.etd ? new Date(body.etd) : undefined,
    })
  } catch (err) {
    console.error('[shipping/webhook]', err)
    return NextResponse.json({ error: 'processing failed' }, { status: 500 })
  }

  return NextResponse.json({ data: { ok: true } })
}

// Shiprocket sends a GET to verify the endpoint when you save it in the dashboard
export async function GET() {
  return NextResponse.json({ ok: true })
}
