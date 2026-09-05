import { staffUnauthorized } from '@/lib/staffAuth'
import { db } from '@/lib/db'
import { categorySchema } from '@/lib/adminValidation'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
type Context = { params: Promise<{resource:string;id:string}> }
async function mutate(req: Request, context: Context) {
 const denied = await staffUnauthorized()
 if (denied) return denied
 const {resource,id} = await context.params
 try {
  if(resource === 'categories' && req.method === 'PATCH') {
   const parsed = categorySchema.safeParse(await req.json().catch(()=>null))
   if(!parsed.success || !/^\d+$/.test(id)) return Response.json({error:'Check category fields. Use an HTTPS image URL and a non-negative display order.'},{status:400})
   await db.category.update({where:{id:Number(id)},data:{...parsed.data,imageUrl:parsed.data.imageUrl || null}})
  } else if(resource === 'reviews' && req.method === 'DELETE' && /^\d+$/.test(id)) {
   await db.$transaction(async tx=>{
    const review = await tx.review.delete({where:{id:Number(id)}})
    const aggregate = await tx.review.aggregate({where:{productId:review.productId},_avg:{rating:true},_count:true})
    await tx.product.update({where:{id:review.productId},data:{rating:aggregate._avg.rating ?? 0,reviewCount:aggregate._count}})
   }, {isolationLevel:Prisma.TransactionIsolationLevel.Serializable})
  } else if(resource === 'subscribers' && req.method === 'DELETE') {
   await db.newsletterSubscriber.delete({where:{id}})
  } else return Response.json({error:'Unsupported operation'},{status:400})
  revalidatePath(`/admin/${resource}`); revalidatePath('/admin'); revalidatePath('/shop','layout'); revalidatePath('/')
  return Response.json({ok:true})
 } catch(error) {
  if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return Response.json({error:'Record not found. Refresh this page.'},{status:404})
  console.error('[admin catalog]',error)
  return Response.json({error:'Could not save changes. Please retry.'},{status:500})
 }
}
export const PATCH = mutate
export const DELETE = mutate
