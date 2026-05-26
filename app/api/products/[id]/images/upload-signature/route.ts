import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { buildUploadSignature } from '@/lib/cloudinary-upload'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const productId = parseInt(id, 10)
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  const signatureData = buildUploadSignature(productId)
  return NextResponse.json(signatureData)
}
