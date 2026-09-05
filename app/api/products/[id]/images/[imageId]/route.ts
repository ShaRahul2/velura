import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { staffUnauthorized } from '@/lib/staffAuth'
import { db } from '@/lib/db'
import { destroyCloudinaryAsset } from '@/lib/cloudinary-upload'

export async function DELETE(
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

  // Remove from Cloudinary if we have the public_id (key)
  if (image.key) {
    await destroyCloudinaryAsset(image.key).catch(() => {
      // Log but don't block — DB row still gets deleted
      console.warn(`[Cloudinary] Could not destroy asset: ${image.key}`)
    })
  }

  await db.$transaction(async tx => {
    await tx.productImage.delete({ where: { id: imgId } })
    if (image.isPrimary) {
      const next = await tx.productImage.findFirst({where:{productId},orderBy:[{position:'asc'},{id:'asc'}]})
      if (next) await tx.productImage.update({where:{id:next.id},data:{isPrimary:true}})
    }
  })
  revalidatePath('/shop', 'layout'); revalidatePath('/')
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{id:string;imageId:string}> }) {
  const denied = await staffUnauthorized()
  if (denied) return denied
  const {id,imageId} = await params
  const productId=Number(id), imgId=Number(imageId)
  if (!Number.isSafeInteger(productId) || productId < 1 || !Number.isSafeInteger(imgId) || imgId < 1) return NextResponse.json({error:'Invalid image ID'},{status:400})
  const body = await req.json().catch(()=>null)
  if (!body || !['earlier','later'].includes(body.direction)) return NextResponse.json({error:'Invalid image direction'},{status:400})
  const moved = await db.$transaction(async tx=>{
    const rows=await tx.productImage.findMany({where:{productId},orderBy:[{position:'asc'},{id:'asc'}],select:{id:true}})
    const index=rows.findIndex(r=>r.id===imgId)
    if(index<0)return false
    const other=index+(body.direction==='earlier'?-1:1)
    if(other<0||other>=rows.length)return true
    ;[rows[index],rows[other]]=[rows[other],rows[index]]
    for(const [position,row] of rows.entries()) await tx.productImage.update({where:{id:row.id},data:{position}})
    return true
  })
  if(!moved)return NextResponse.json({error:'Image not found'},{status:404})
  revalidatePath('/shop','layout');revalidatePath('/')
  return NextResponse.json({ok:true})
}
