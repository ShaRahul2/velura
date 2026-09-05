import { NextResponse } from 'next/server'
import { requireCustomerProfile } from '@/lib/customerAuth'
import type { Profile } from '@prisma/client'

export async function withCustomer(): Promise<
  { profile: Profile; error?: undefined } | { profile?: undefined; error: NextResponse }
> {
  try {
    const profile = await requireCustomerProfile()
    return { profile }
  } catch (err) {
    if (err instanceof Error && err.name === 'UnauthorizedError') {
      return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    throw err
  }
}
