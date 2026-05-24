'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { products as allProducts } from '@/data/products'
import type { Product, ProductCategory } from '@/types'
import { ProductGrid } from './ProductGrid'
import { FilterSidebar } from './FilterSidebar'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'

function sortProducts(list: Product[], sort: string): Product[] {
  const copy = [...list]
  switch (sort) {
    case 'rating':     return copy.sort((a, b) => b.rating - a.rating)
    case 'price-asc':  return copy.sort((a, b) => a.price - b.price)
    case 'price-desc': return copy.sort((a, b) => b.price - a.price)
    case 'new':        return copy.filter((p) => p.badge === 'New').concat(copy.filter((p) => p.badge !== 'New'))
    default:           return copy
  }
}

function ShopInner() {
  const searchParams = useSearchParams()
  const [cols, setCols] = useState<2 | 3>(3)

  const cat     = searchParams.get('cat') as ProductCategory | null
  const support = searchParams.get('support')
  const sort    = searchParams.get('sort') ?? ''

  let filtered = allProducts
  if (cat)     filtered = filtered.filter((p) => p.cat === cat)
  if (support) filtered = filtered.filter((p) => p.support === support)
  const sorted = sortProducts(filtered, sort)

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      <div className="mb-10">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
          {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All collections'}
        </p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.9rem)', letterSpacing: '-0.01em' }}
        >
          {cat
            ? `${cat.charAt(0).toUpperCase() + cat.slice(1)} bras`
            : 'The full collection.'}
        </h1>
      </div>

      <div className="flex gap-10">
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <div className="flex-1 min-w-0">
          <Suspense>
            <SortBar total={sorted.length} cols={cols} onColsChange={setCols} />
          </Suspense>

          {sorted.length > 6 ? (
            <>
              <ProductGrid products={sorted.slice(0, 6)} cols={cols} />
              <BuilderPromoBanner />
              <ProductGrid products={sorted.slice(6)} cols={cols} />
            </>
          ) : (
            <ProductGrid products={sorted} cols={cols} />
          )}
        </div>
      </div>
    </div>
  )
}

export function ShopContent() {
  return (
    <Suspense>
      <ShopInner />
    </Suspense>
  )
}
