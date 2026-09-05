import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { staffUnauthorized } from '@/lib/staffAuth'
import { buildUploadSignature } from '@/lib/cloudinary-upload'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await staffUnauthorized()
  if (denied) return denied

  const { id } = await params
  const productId = Number(id)
  if (!Number.isSafeInteger(productId) || productId < 1) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  if (!await db.product.findUnique({where:{id:productId},select:{id:true}})) return NextResponse.json({error:'Product not found'},{status:404})
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return NextResponse.json({error:'Image uploads are not configured'},{status:503})
  const signatureData = buildUploadSignature(productId)
  return NextResponse.json(signatureData)
}
