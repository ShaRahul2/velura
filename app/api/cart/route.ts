import { NextRequest, NextResponse } from 'next/server'
import { withCustomer } from '@/lib/withCustomer'
import { cartItemsSchema, asCartItems } from '@/lib/accountSchemas'
import { listCartItems, mergeGuestCart, replaceCart } from '@/lib/cartServer'

export async function GET() {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const data = await listCartItems(auth.profile.id)
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const parsed = cartItemsSchema.safeParse((await req.json())?.items)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid bag' }, { status: 400 })
  }
  const data = await replaceCart(auth.profile.id, asCartItems(parsed.data))
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const parsed = cartItemsSchema.safeParse((await req.json())?.items)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid bag' }, { status: 400 })
  }
  const data = await mergeGuestCart(auth.profile.id, asCartItems(parsed.data))
  return NextResponse.json({ data })
}
