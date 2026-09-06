import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomerProfile } from '@/lib/staffAuth'
import { replaceWishlist, toggleWishlist, wishlistIdsForProfile } from '@/lib/accountCommerce'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

export async function GET() {
  const profile = await requireCustomerProfile()
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ data: await wishlistIdsForProfile(profile.id) })
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await checkRateLimit(`wishlist:${clientIp(req)}`, 60, 10 * 60 * 1000))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const profile = await requireCustomerProfile()
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const parsed = z.object({ ids: z.array(z.number().int().positive()).max(100) }).safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid wishlist' }, { status: 400 })
    const ids = await replaceWishlist(profile.id, parsed.data.ids)
    return NextResponse.json({ data: ids })
  } catch (err) {
    console.error('[PUT /api/wishlist]', err)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(`wishlist:${clientIp(req)}`, 60, 10 * 60 * 1000))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const profile = await requireCustomerProfile()
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const parsed = z.object({ productId: z.number().int().positive() }).safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    const result = await toggleWishlist(profile.id, parsed.data.productId)
    return NextResponse.json({ data: result })
  } catch (err) {
    console.error('[POST /api/wishlist]', err)
    return NextResponse.json({ error: 'Could not update' }, { status: 500 })
  }
}
