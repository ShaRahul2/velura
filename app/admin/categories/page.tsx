import { requireAdmin } from '@/lib/adminSession'
import { db } from '@/lib/db'
import { AdminHeader, Empty } from '@/components/admin/AdminUI'
import { CategoryForm } from '@/components/admin/CategoryForm'
export const dynamic='force-dynamic'
export default async function Categories(){await requireAdmin();const categories=await db.category.findMany({orderBy:{sortOrder:'asc'}});return <div className="admin-page"><AdminHeader title="Categories" description="Edit the seven catalogue collections and their display order." />{!categories.length&&<Empty>No categories are configured. Run the catalogue seed before adding products.</Empty>}<div className="grid gap-5 lg:grid-cols-2">{categories.map(c=><CategoryForm key={c.id} category={c}/>)}</div></div>}
