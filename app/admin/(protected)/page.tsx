import Link from 'next/link'
import { requireAdmin } from '@/lib/adminSession'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { ORDER_LABEL, PAYMENT_LABEL, formatAdminDate } from '@/lib/adminOrders'
import { AdminHeader, Empty } from '@/components/admin/AdminUI'
export const dynamic = 'force-dynamic'
export default async function AdminPage() {
 await requireAdmin()
 const [paid, pending, products, drafts, subscribers, latest] = await Promise.all([
 db.order.aggregate({where:{paymentStatus:'paid'},_sum:{total:true},_count:true}),
 db.order.count({where:{status:{in:['pending','confirmed']}}}), db.product.count({where:{isActive:true}}),db.product.count({where:{isActive:false}}),db.newsletterSubscriber.count(),
 db.order.findMany({orderBy:{createdAt:'desc'},take:8}),
 ])
 const stats = [{label:'Collected revenue',value:formatPrice(paid._sum.total ?? 0),detail:`${paid._count} paid orders · excludes refunded payments`,href:'/admin/orders?payment=paid'}, {label:'To fulfil',value:pending,detail:'Received and confirmed orders',href:'/admin/orders?queue=fulfilment'}, {label:'Live products',value:products,detail:`${drafts} drafts in your catalogue`,href:'/admin/products'}, {label:'Subscribers',value:subscribers,detail:'Newsletter audience',href:'/admin/subscribers'}]
 return <div className="admin-page"><AdminHeader title="Store overview" description="Your catalogue, customers, and daily operations in one place."><Link className="admin-button" href="/admin/products/new">Add product</Link></AdminHeader>
 <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(s=><Link key={s.label} href={s.href} className="rounded border border-[#413830] bg-[#1b1714] p-6 hover:border-[#B8A898]"><p className="admin-eyebrow">{s.label}</p><p className="my-3 font-serif text-4xl">{s.value}</p><p className="text-xs leading-relaxed text-[#B8A898]">{s.detail}</p></Link>)}</div>
 <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl">Recent orders</h2><Link className="admin-link text-sm" href="/admin/orders">All orders</Link></div>
 {latest.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{['Order','Customer','Payment','Fulfilment','Total'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{latest.map(o=><tr key={o.id}><td><Link className="admin-link" href={`/admin/orders/${encodeURIComponent(o.id)}`}>{o.id}</Link><p className="mt-2 text-xs text-[#B8A898]">{formatAdminDate(o.createdAt)}</p></td><td>{o.firstName} {o.lastName}</td><td>{PAYMENT_LABEL[o.paymentStatus]}</td><td>{ORDER_LABEL[o.status]}</td><td>{formatPrice(o.total)}</td></tr>)}</tbody></table></div>:<Empty>Your first customer order will appear here.</Empty>}
 </div>
}
