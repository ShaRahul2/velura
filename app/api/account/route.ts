import { NextResponse } from 'next/server'
import { requireCustomerProfile } from '@/lib/staffAuth'
import { db } from '@/lib/db'

export async function GET() {
  const profile = await requireCustomerProfile()
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const addresses = await db.address.findMany({
    where: { profileId: profile.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({
    data: {
      email: profile.email,
      fullName: profile.fullName,
      phone: profile.phone,
      addresses,
    },
  })
}
