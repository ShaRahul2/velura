import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withCustomer } from '@/lib/withCustomer'
import { wishlistIdsSchema } from '@/lib/accountSchemas'
import { listWishlistIds, mergeGuestWishlist, replaceWishlist, toggleWishlist } from '@/lib/wishlistServer'

export async function GET() {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const data = await listWishlistIds(auth.profile.id)
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const body = await req.json() as { productId?: unknown; ids?: unknown }
  if (Array.isArray(body.ids)) {
    const parsed = wishlistIdsSchema.safeParse(body.ids)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid saved list' }, { status: 400 })
    }
    const data = await mergeGuestWishlist(auth.profile.id, parsed.data)
    return NextResponse.json({ data })
  }
  const parsed = z.object({ productId: z.number().int().positive() }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
  }
  const result = await toggleWishlist(auth.profile.id, parsed.data.productId)
  return NextResponse.json({ data: result })
}

export async function PUT(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const parsed = wishlistIdsSchema.safeParse((await req.json())?.ids)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid saved list' }, { status: 400 })
  }
  const data = await replaceWishlist(auth.profile.id, parsed.data)
  return NextResponse.json({ data })
}
