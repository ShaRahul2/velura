import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { COUPONS, calcDiscount } from '@/lib/coupons'

const Schema = z.object({
  code:     z.string().min(1).max(32),
  subtotal: z.number().int().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { code, subtotal } = parsed.data
    const upperCode = code.toUpperCase()

    if (!COUPONS[upperCode]) {
      return NextResponse.json({ error: 'Invalid coupon code.' }, { status: 422 })
    }

    const discount = calcDiscount(upperCode, subtotal)
    return NextResponse.json({ data: { code: upperCode, discount } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
