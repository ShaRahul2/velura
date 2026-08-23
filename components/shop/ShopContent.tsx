'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, ProductCategory } from '@/types'
import { formatPrice, pageWrap } from '@/lib/utils'
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
  query?:          string
}

export function ShopContent({ initialProducts, total, currentPage, currentCat, query }: ShopContentProps) {
  const [cols, setCols] = useState<2 | 3 | 4>(3)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const cat        = currentCat as ProductCategory | undefined

  const catLabel = cat
    ? cat.charAt(0).toUpperCase() + cat.slice(1)
    : 'All collections'

  const headingText = query
    ? `Results for “${query}”`
    : cat
      ? `${cat.charAt(0).toUpperCase() + cat.slice(1)} bras`
      : 'The full collection.'

  const first6 = initialProducts.slice(0, 6)
  const rest   = initialProducts.slice(6)

  return (
    <div className={`${pageWrap} py-10 md:py-14 lg:py-16`}>
      <div className="mb-8 md:mb-12">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
          {catLabel}
        </p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', letterSpacing: '-0.01em' }}
        >
          {headingText}
        </h1>
      </div>

      <div className="flex gap-8 lg:gap-12">
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <div className="flex-1 min-w-0">
          <Suspense>
            <SortBar total={total} cols={cols} onColsChange={setCols} />
          </Suspense>

          {initialProducts.length === 0 ? (
            <p className="font-serif text-[1.4rem] font-light text-deep py-16">
              Nothing in this cut. Try another word.
            </p>
          ) : initialProducts.length > 6 ? (
            <>
              <ProductGrid products={first6} cols={cols} onQuickView={setQuickViewProduct} />
              <BuilderPromoBanner />
              <ProductGrid products={rest} cols={cols} onQuickView={setQuickViewProduct} />
            </>
          ) : (
            <ProductGrid products={initialProducts} cols={cols} onQuickView={setQuickViewProduct} />
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/55 p-4"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${quickViewProduct.name}`}
        >
          <div
            className="bg-cream max-w-2xl w-full rounded-card overflow-hidden shadow-overlay grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4] bg-blush">
              <Image
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="font-serif text-[1.5rem] font-light text-deep leading-tight">
                  {quickViewProduct.name}
                </h3>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-mauve hover:text-deep text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="font-sans text-sm text-mauve mb-3">{quickViewProduct.story}</p>
              <p className="font-sans text-lg text-deep mb-6">{formatPrice(quickViewProduct.price)}</p>

              <Link
                href={`/shop/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="w-full h-11 flex items-center justify-center font-sans text-sm tracking-btn uppercase bg-deep text-blush rounded-btn hover:tracking-wide transition-all"
              >
                Choose size
              </Link>
              <p className="text-center mt-4 text-xs text-mauve">Sizes: {quickViewProduct.sizes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
