import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withCustomer } from '@/lib/withCustomer'
import { db } from '@/lib/db'

const profilePatchSchema = z.object({
  fullName: z.string().min(1).max(80).optional(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').nullable().optional(),
  role: z.unknown().optional(),
})

export async function GET() {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  return NextResponse.json({ data: auth.profile })
}

export async function PATCH(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const parsed = profilePatchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile' }, { status: 400 })
  }
  const { fullName, phone } = parsed.data
  const profile = await db.profile.update({
    where: { id: auth.profile.id },
    data: {
      ...(fullName !== undefined ? { fullName } : {}),
      ...(phone !== undefined ? { phone } : {}),
    },
  })
  return NextResponse.json({ data: profile })
}
