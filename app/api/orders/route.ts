import { NextRequest, NextResponse } from 'next/server'
import type { OrderItem, Address } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const { items, address, paymentMethod } = body as {
      items: OrderItem[]
      address: Address
      paymentMethod: string
    }
    if (!items?.length || !address || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderId = `VLR-${Date.now()}-${Math.floor(Math.random() * 10000)}`

    return NextResponse.json({ data: { orderId } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
