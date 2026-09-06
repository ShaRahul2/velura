import Link from 'next/link'
import { requireAdmin } from '@/lib/adminSession'
import { db } from '@/lib/db'
import { AdminHeader, SearchForm, Pagination, Empty, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'
import { DeleteRecord } from '@/components/admin/DeleteRecord'
import { formatAdminDate } from '@/lib/adminOrders'
import type { Prisma } from '@prisma/client'
export const dynamic='force-dynamic'
export default async function Reviews({searchParams}:{searchParams:Promise<AdminParams>}){
 await requireAdmin(); const params=await searchParams;const q=param(params,'q');const page=pageNumber(params)
 const where:Prisma.ReviewWhereInput=q?{OR:[{author:{contains:q,mode:'insensitive'}},{body:{contains:q,mode:'insensitive'}},{product:{name:{contains:q,mode:'insensitive'}}}]}:{}
 const [rows,total]=await Promise.all([db.review.findMany({where,include:{product:{select:{name:true}}},orderBy:{id:'desc'},skip:(page-1)*25,take:25}),db.review.count({where})])
 return <div className="admin-page"><AdminHeader title="Reviews" description="Moderate customer feedback. Removing a review recalculates its product’s rating."/><SearchForm q={q} placeholder="Author, product or review text"/>{rows.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr>{['Product','Review','Author','Date','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><Link className="admin-link" href={`/admin/products/${r.productId}/edit`}>{r.product.name}</Link></td><td><p>{r.rating} / 5</p><p className="mt-2 max-w-lg whitespace-pre-wrap text-[#B8A898]">{r.body||'No written review'}</p></td><td>{r.author}<p className="mt-1 text-xs text-[#B8A898]">{r.verified?'Verified purchase':'Unverified'}</p></td><td>{formatAdminDate(r.createdAt)}</td><td><DeleteRecord resource="reviews" id={String(r.id)} label={`review by ${r.author}`}/></td></tr>)}</tbody></table></div>:<Empty>No reviews match these filters.</Empty>}<Pagination page={page} total={total} params={params}/></div>
}
