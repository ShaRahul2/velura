import { NextRequest, NextResponse } from 'next/server'
import { queryProducts, createProduct } from '@/lib/products'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const result = await queryProducts({
      cat:     searchParams.get('cat')     ?? undefined,
      support: searchParams.get('support') ?? undefined,
      sort:    searchParams.get('sort')    ?? undefined,
      page:    Number(searchParams.get('page')  ?? 1),
      limit:   Number(searchParams.get('limit') ?? 12),
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const product = await createProduct(body)
    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/products]', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
