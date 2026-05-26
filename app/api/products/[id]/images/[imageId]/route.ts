import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { destroyCloudinaryAsset } from '@/lib/cloudinary-upload'

export async function DELETE(
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

  // Remove from Cloudinary if we have the public_id (key)
  if (image.key) {
    await destroyCloudinaryAsset(image.key).catch(() => {
      // Log but don't block — DB row still gets deleted
      console.warn(`[Cloudinary] Could not destroy asset: ${image.key}`)
    })
  }

  await db.productImage.delete({ where: { id: imgId } })
  return NextResponse.json({ ok: true })
}
