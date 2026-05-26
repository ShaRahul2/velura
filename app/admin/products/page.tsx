import Link from 'next/link'
import { queryAllProducts } from '@/lib/products'
import { Plus } from 'lucide-react'
import { AdminProductRow } from './AdminProductRow'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await queryAllProducts()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.4rem] font-serif font-light text-[#EDE9E4] tracking-[-0.01em]">
            Products
          </h1>
          <p className="text-[0.72rem] text-[rgba(237,233,228,0.35)] mt-0.5">
            {products.length} product{products.length !== 1 ? 's' : ''} total
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

      {/* Table */}
      <div className="border border-[rgba(184,168,152,0.1)] rounded-[4px] overflow-hidden">
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
    </div>
  )
}
