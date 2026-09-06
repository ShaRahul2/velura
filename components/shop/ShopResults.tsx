'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import type { ShopQuery } from '@/lib/shopQuery'
import { ProductGrid } from './ProductGrid'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'
import { Pagination } from './Pagination'

interface ShopResultsProps {
  products: Product[]
  total: number
  page: number
  totalPages: number
  query: ShopQuery
}

export function ShopResults({ products, total, page, totalPages, query }: ShopResultsProps) {
  const [cols, setCols] = useState<2 | 3 | 4>(4)
  const first8 = products.slice(0, 8)
  const rest = products.slice(8)

  return (
    <>
      <SortBar total={total} cols={cols} onColsChange={setCols} query={query} />

      {products.length === 0 ? (
        <div className="border border-lm bg-blush/40 px-6 py-20 text-center">
          <p className="mb-3 font-serif text-[1.5rem] font-light text-deep">
            Nothing in this cut.
          </p>
          <p className="mb-6 font-sans text-[0.86rem] font-light text-mauve">
            Try another word, or start from the full collection.
          </p>
          <Link
            href="/shop"
            className="font-sans text-[0.78rem] tracking-btn uppercase text-deep underline underline-offset-4"
          >
            View all
          </Link>
        </div>
      ) : products.length > 8 ? (
        <>
          <ProductGrid products={first8} cols={cols} priorityCount={4} />
          <BuilderPromoBanner />
          <ProductGrid products={rest} cols={cols} />
        </>
      ) : (
        <ProductGrid products={products} cols={cols} priorityCount={4} />
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} query={query} />
      )}
    </>
  )
}
