import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { staffUnauthorized } from '@/lib/staffAuth'
import { db } from '@/lib/db'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const denied = await staffUnauthorized()
  if (denied) return denied

  const { id, imageId } = await params
  const productId = Number(id)
  const imgId     = Number(imageId)
  if (!Number.isSafeInteger(productId) || productId < 1 || !Number.isSafeInteger(imgId) || imgId < 1) {
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

  revalidatePath('/shop', 'layout'); revalidatePath('/')
  return NextResponse.json({ ok: true })
}
