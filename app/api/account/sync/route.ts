import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomerProfile } from '@/lib/staffAuth'
import { mergeGuestCart, mergeGuestWishlist } from '@/lib/accountCommerce'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'
import type { CartItem } from '@/types'

const CartItemSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(200),
  price: z.number().int().nonnegative(),
  qty: z.number().int().min(1).max(10),
  size: z.string().min(0).max(40),
  emoji: z.string().max(16).optional().default(''),
  images: z.array(z.string()).max(12).optional().default([]),
  color: z.string().max(32).optional(),
  colorLabel: z.string().max(40).optional(),
  isCustom: z.boolean().optional(),
  customSpec: z.unknown().optional(),
  customGrad: z.string().max(400).optional(),
})

const Body = z.object({
  cart: z.array(CartItemSchema).max(50).optional().default([]),
  wishlist: z.array(z.number().int().positive()).max(100).optional().default([]),
})

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(`account-sync:${clientIp(req)}`, 30, 10 * 60 * 1000))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const profile = await requireCustomerProfile()
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const parsed = Body.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    const [cart, wishlist] = await Promise.all([
      mergeGuestCart(profile.id, parsed.data.cart as CartItem[]),
      mergeGuestWishlist(profile.id, parsed.data.wishlist),
    ])
    return NextResponse.json({ data: { cart, wishlist } })
  } catch (err) {
    console.error('[POST /api/account/sync]', err)
    return NextResponse.json({ error: 'Could not sync account' }, { status: 500 })
  }
}
