import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  const images = await db.productImage.findMany({
    where:   { productId },
    orderBy: { position: 'asc' },
  })
  return NextResponse.json({ data: images })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  const body = await req.json() as {
    key?:       unknown
    url?:       unknown
    alt?:       unknown
    position?:  unknown
    type?:      unknown
    isPrimary?: unknown
  }
  const { key, url, alt, position, type, isPrimary } = body

  if (typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  await db.$transaction(async (tx) => {
    if (isPrimary === true) {
      await tx.productImage.updateMany({
        where: { productId },
        data:  { isPrimary: false },
      })
    }
    return tx.productImage.create({
      data: {
        productId,
        url,
        key:       typeof key      === 'string'  ? key       : null,
        alt:       typeof alt      === 'string'  ? alt       : null,
        position:  typeof position === 'number'  ? position  : 0,
        type:      typeof type     === 'string'  ? (type as import('@prisma/client').ImageType) : 'front',
        isPrimary: isPrimary === true,
      },
    })
  })

  const image = await db.productImage.findFirst({
    where:   { productId, url },
    orderBy: { id: 'desc' },
  })
  return NextResponse.json({ data: image }, { status: 201 })
}
