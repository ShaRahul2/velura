import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomerProfile } from '@/lib/staffAuth'
import { cartItemsForProfile, replaceCart } from '@/lib/accountCommerce'
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

export async function GET() {
  const profile = await requireCustomerProfile()
  if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await cartItemsForProfile(profile.id)
  return NextResponse.json({ data: items })
}

export async function PUT(req: NextRequest) {
  try {
    const profile = await requireCustomerProfile()
    if (!profile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const parsed = z.object({ items: z.array(CartItemSchema).max(50) }).safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid cart' }, { status: 400 })
    const items = await replaceCart(profile.id, parsed.data.items as CartItem[])
    return NextResponse.json({ data: items })
  } catch (err) {
    console.error('[PUT /api/cart]', err)
    return NextResponse.json({ error: 'Could not save bag' }, { status: 500 })
  }
}
