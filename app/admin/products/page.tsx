import { requireAdmin } from '@/lib/adminSession'
import Link from 'next/link'
import { mapDbProductToProduct } from '@/lib/products'
import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import { SearchForm, Pagination, Empty, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'
import { Plus } from 'lucide-react'
import { AdminProductRow } from './AdminProductRow'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<AdminParams> }) {
  await requireAdmin()
  const params = await searchParams; const q = param(params,'q'); const page = pageNumber(params); const status = param(params,'status')
  const where: Prisma.ProductWhereInput = { ...(q && {name:{contains:q,mode:'insensitive'}}), ...(status === 'draft' ? {isActive:false} : status === 'active' ? {isActive:true} : {}) }
  const [rows,total] = await Promise.all([db.product.findMany({where, include:{category:true,images:{orderBy:{position:'asc'}}},orderBy:{id:'desc'},take:25,skip:(page-1)*25}),db.product.count({where})])
  const products = rows.map(mapDbProductToProduct)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.4rem] font-serif font-light text-[#EDE9E4] tracking-[-0.01em]">
            Products
          </h1>
          <p className="text-[0.72rem] text-[rgba(237,233,228,0.35)] mt-0.5">
            {total} product{products.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#EDE9E4] text-[#0F0D0B] rounded-[3px] text-[0.75rem] tracking-[0.1em] uppercase hover:bg-[#F8F6F3] transition-colors"
        >
          <Plus size={13} />
          New Product
        </Link>
      </div>

      <SearchForm q={q} placeholder="Search products by name"><label className="text-xs text-[#B8A898]">Visibility<select className="admin-input mt-2" name="status" defaultValue={status}><option value="">All products</option><option value="active">Active</option><option value="draft">Draft</option></select></label></SearchForm>
      {!products.length && <Empty>No products match these filters. Create a product to get started.</Empty>}
      {/* Table */}
      <div className="border border-[rgba(184,168,152,0.1)] rounded-[4px] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(184,168,152,0.1)] bg-[rgba(237,233,228,0.03)]">
              {['Product', 'Category', 'Price', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[0.62rem] tracking-[0.12em] text-[rgba(237,233,228,0.35)] uppercase font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <AdminProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} params={params} />
    </div>
  )
}
