import { productSchema, validPrice } from '@/lib/adminValidation'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { queryProducts, createProduct, DuplicateProductNameError } from '@/lib/products'
import { staffUnauthorized } from '@/lib/staffAuth'

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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    console.error('[GET /api/products]', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await staffUnauthorized()
    if (denied) return denied

    const parsed = productSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success || !validPrice(parsed.data)) return NextResponse.json({ error: 'Check product fields. Prices must be positive whole rupees and old price cannot be below price.' }, { status: 400 })
    const body = parsed.data
    const product = await createProduct(body)
    revalidatePath('/shop'); revalidatePath('/'); revalidatePath('/admin/products')
    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err) {
    if (err instanceof DuplicateProductNameError) return NextResponse.json({ error: err.message }, { status: 409 })
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    console.error('[POST /api/products]', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
