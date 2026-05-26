import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, imageId } = await params
  const productId = parseInt(id, 10)
  const imgId     = parseInt(imageId, 10)
  if (isNaN(productId) || isNaN(imgId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const image = await db.productImage.findUnique({ where: { id: imgId } })
  if (!image || image.productId !== productId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.$transaction([
    db.productImage.updateMany({ where: { productId }, data: { isPrimary: false } }),
    db.productImage.update({ where: { id: imgId }, data: { isPrimary: true } }),
  ])

  return NextResponse.json({ ok: true })
}
