import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ data: product })
}
