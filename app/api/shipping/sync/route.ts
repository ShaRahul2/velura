import { NextRequest, NextResponse } from 'next/server'
import { dueForSync, syncShipmentTracking, isShiprocketConfigured } from '@/lib/shipping'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Fallback poller for missed webhooks. Wired to Vercel Cron (see vercel.json).
 * Vercel Cron requests carry `Authorization: Bearer $CRON_SECRET` automatically
 * when CRON_SECRET is set; we also accept `?key=` for manual runs.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') ?? ''
  const key = req.nextUrl.searchParams.get('key') ?? ''
  if (secret && auth !== `Bearer ${secret}` && key !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!isShiprocketConfigured()) {
    return NextResponse.json({ data: { skipped: 'shiprocket not configured' } })
  }

  const limit = Math.min(80, Number(req.nextUrl.searchParams.get('limit') ?? 40))
  const rows = await dueForSync(limit)

  const results = await Promise.allSettled(rows.map((r) => syncShipmentTracking(r.id)))
  const ok = results.filter((r) => r.status === 'fulfilled').length

  return NextResponse.json({
    data: { checked: rows.length, updated: ok, failed: rows.length - ok },
  })
}
