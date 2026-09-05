import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email || session.user.email.toLowerCase().trim() !== process.env.ADMIN_EMAIL?.toLowerCase().trim()) return NextResponse.json({error:'Unauthorized'},{status:401})
  const { id } = await params
  const productId = Number(id)
  if (!Number.isSafeInteger(productId) || productId < 1) {
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
  if (!session?.user?.email || session.user.email.toLowerCase().trim() !== process.env.ADMIN_EMAIL?.toLowerCase().trim()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const productId = Number(id)
  if (!Number.isSafeInteger(productId) || productId < 1) {
    return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
  }

  const parsed = z.object({
    key: z.string().max(500).optional(), url: z.url().startsWith('https://'), alt: z.string().max(500).optional(),
    position: z.number().int().min(0).max(10000).optional(), type: z.enum(['front','back','lifestyle','detail']).optional(), isPrimary: z.boolean().optional(),
  }).strict().safeParse(await req.json().catch(()=>null))
  if (!parsed.success) return NextResponse.json({error:'Invalid image metadata'},{status:400})
  const {key,url,alt,position,type,isPrimary} = parsed.data
  if (!await db.product.findUnique({where:{id:productId},select:{id:true}})) return NextResponse.json({error:'Product not found'},{status:404})

  await db.$transaction(async (tx) => {
    const primary = isPrimary === true || await tx.productImage.count({where:{productId}}) === 0
    if (primary) {
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
        isPrimary: primary,
      },
    })
  })

  const image = await db.productImage.findFirst({
    where:   { productId, url },
    orderBy: { id: 'desc' },
  })
  revalidatePath('/shop', 'layout'); revalidatePath('/')
  return NextResponse.json({ data: image }, { status: 201 })
}
