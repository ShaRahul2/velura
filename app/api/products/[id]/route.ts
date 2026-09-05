import { productSchema, validPrice } from '@/lib/adminValidation'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/products'
import { staffUnauthorized } from '@/lib/staffAuth'
import { destroyCloudinaryAsset } from '@/lib/cloudinary-upload'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    const product = await getProductById(Number(id))
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: product })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    console.error('[GET /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const denied = await staffUnauthorized()
    if (denied) return denied

    const { id } = await params
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    const parsed = productSchema.partial().safeParse(await req.json().catch(() => null))
    if (!parsed.success || !validPrice(parsed.data)) return NextResponse.json({ error: 'Invalid product fields.' }, { status: 400 })
    const existing = await db.product.findUnique({where:{id:Number(id)},select:{price:true,oldPrice:true}})
    if (!existing) return NextResponse.json({error:'Product not found'},{status:404})
    if (!validPrice({...existing,...parsed.data})) return NextResponse.json({error:'Old price cannot be below the selling price.'},{status:400})
    const body = parsed.data
    const product = await updateProduct(Number(id), body)
    revalidatePath('/shop', 'layout'); revalidatePath('/'); revalidatePath('/admin/products')
    return NextResponse.json({ data: product })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    console.error('[PUT /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  try {
    const denied = await staffUnauthorized()
    if (denied) return denied

    const { id }       = await params
    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) return NextResponse.json({error:'Invalid product ID'},{status:400})
    const publicIds    = await deleteProduct(Number(id))

    // Delete all Cloudinary assets — fire-and-forget, failures don't block
    await Promise.allSettled(publicIds.map(destroyCloudinaryAsset))

    revalidatePath('/shop', 'layout'); revalidatePath('/'); revalidatePath('/admin/products')
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    console.error('[DELETE /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
