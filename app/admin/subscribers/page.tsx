import { requireAdmin } from '@/lib/adminSession'
import { db } from '@/lib/db'
import { AdminHeader, SearchForm, Pagination, Empty, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'
import { DeleteRecord } from '@/components/admin/DeleteRecord'
import { formatAdminDate } from '@/lib/adminOrders'
export const dynamic='force-dynamic'
export default async function Subscribers({searchParams}:{searchParams:Promise<AdminParams>}){
 await requireAdmin();const params=await searchParams;const q=param(params,'q');const page=pageNumber(params);const where={email:{contains:q,mode:'insensitive' as const}}
 const [rows,total]=await Promise.all([db.newsletterSubscriber.findMany({where,orderBy:{createdAt:'desc'},skip:(page-1)*25,take:25}),db.newsletterSubscriber.count({where})])
 return <div className="admin-page"><AdminHeader title="Subscribers" description="Manage newsletter subscriptions and unsubscribe requests."/><SearchForm q={q} placeholder="Search email addresses"/>{rows.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Email</th><th>Subscribed</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.email}</td><td>{formatAdminDate(r.createdAt)}</td><td><DeleteRecord resource="subscribers" id={r.id} label={`${r.email} from the newsletter`}/></td></tr>)}</tbody></table></div>:<Empty>No subscribers match these filters.</Empty>}<Pagination page={page} total={total} params={params}/></div>
}
