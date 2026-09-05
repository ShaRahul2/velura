import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireCustomerId } from '@/lib/staffAuth'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profileId = await requireCustomerId()
  if (!profileId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const order = await db.order.findFirst({
    where: { id, profileId },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: order })
}
