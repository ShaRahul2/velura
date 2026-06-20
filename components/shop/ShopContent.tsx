'use client'

import { useState, Suspense } from 'react'
import type { Product, ProductCategory } from '@/types'
import { ProductGrid } from './ProductGrid'
import { FilterSidebar } from './FilterSidebar'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'
import { Pagination } from './Pagination'

const ITEMS_PER_PAGE = 12

interface ShopContentProps {
  initialProducts: Product[]
  total:           number
  currentPage:     number
  currentCat?:     string
}

export function ShopContent({ initialProducts, total, currentPage, currentCat }: ShopContentProps) {
  const [cols, setCols] = useState<2 | 3 | 4 | 5>(3)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const cat        = currentCat as ProductCategory | undefined

  const catLabel = cat
    ? cat.charAt(0).toUpperCase() + cat.slice(1)
    : 'All collections'

  const headingText = cat
    ? `${cat.charAt(0).toUpperCase() + cat.slice(1)} bras`
    : 'The full collection.'

  const first6 = initialProducts.slice(0, 6)
  const rest   = initialProducts.slice(6)

  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] mx-auto px-6 md:px-10 py-12 lg:py-16 2xl:py-20">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-[0.68rem] lg:text-[0.74rem] tracking-label uppercase text-rose mb-3">
          {catLabel}
        </p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.4rem)', letterSpacing: '-0.01em' }}
        >
          {headingText}
        </h1>
      </div>

      <div className="flex gap-10">
        {/* Desktop filter sidebar */}
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <Suspense>
            <SortBar total={total} cols={cols} onColsChange={setCols} />
          </Suspense>

          {/* Product grid — banner injected after first 6 */}
          {initialProducts.length > 6 ? (
            <>
              <ProductGrid products={first6} cols={cols} />
              <BuilderPromoBanner />
              <ProductGrid products={rest} cols={cols} />
            </>
          ) : (
            <ProductGrid products={initialProducts} cols={cols} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
