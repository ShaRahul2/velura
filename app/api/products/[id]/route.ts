import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/products'
import { auth } from '@/auth'
import { destroyCloudinaryAsset } from '@/lib/cloudinary-upload'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const product = await getProductById(Number(id))
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: product })
  } catch (err) {
    console.error('[GET /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body    = await req.json()
    const product = await updateProduct(Number(id), body)
    return NextResponse.json({ data: product })
  } catch (err) {
    console.error('[PUT /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id }       = await params
    const publicIds    = await deleteProduct(Number(id))

    // Delete all Cloudinary assets — fire-and-forget, failures don't block
    await Promise.allSettled(publicIds.map(destroyCloudinaryAsset))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
