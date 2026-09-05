import { NextRequest, NextResponse } from 'next/server'
import { withCustomer } from '@/lib/withCustomer'
import { addressInputSchema, deleteAddress, listAddresses, upsertAddress } from '@/lib/addressBook'

export async function GET() {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const data = await listAddresses(auth.profile.id)
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const parsed = addressInputSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid address' }, { status: 400 })
  }
  const data = await upsertAddress(auth.profile.id, parsed.data)
  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  try {
    await deleteAddress(auth.profile.id, id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }
    throw err
  }
}
