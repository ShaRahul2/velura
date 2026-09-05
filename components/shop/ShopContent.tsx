'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, ProductCategory } from '@/types'
import { pageWrap } from '@/lib/utils'
import { ProductGrid } from './ProductGrid'
import { FilterSidebar } from './FilterSidebar'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'
import { Pagination } from './Pagination'
import { CollectionChips } from './CollectionChips'

const ITEMS_PER_PAGE = 12

const CAT_COPY: Record<string, string> = {
  everyday: 'The ones you forget you are wearing.',
  pushup: 'Shape, then forgotten.',
  lace: 'Delicate. Precise.',
  sports: 'For the moves that matter.',
  seamless: 'Invisible under anything.',
  plus: 'Built for every curve. Designed, not adjusted.',
  bridal: 'Worn once. Remembered forever.',
}

interface ShopContentProps {
  initialProducts: Product[]
  total: number
  currentPage: number
  currentCat?: string
  query?: string
}

export function ShopContent({
  initialProducts,
  total,
  currentPage,
  currentCat,
  query,
}: ShopContentProps) {
  const [cols, setCols] = useState<2 | 3 | 4>(4)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const cat = currentCat as ProductCategory | undefined

  const headingText = query
    ? `Results for “${query}”`
    : cat
      ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}`
      : 'The collection.'

  const first8 = initialProducts.slice(0, 8)
  const rest = initialProducts.slice(8)
  const showBanner = Boolean(cat && !query)

  return (
    <div>
      {showBanner ? (
        <div className="relative mb-10 h-[38vh] min-h-[240px] max-h-[420px] overflow-hidden bg-deep md:mb-14 md:h-[46vh]">
          <Image
            src={`/images/categories/${cat}.jpg`}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(15,13,11,0.62) 0%, rgba(15,13,11,0.10) 100%)',
            }}
          />
          <div className={`relative z-10 flex h-full flex-col justify-end ${pageWrap} pb-8 md:pb-12`}>
            <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
              Collection
            </p>
            <h1
              className="font-serif font-light text-blush"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', letterSpacing: '-0.02em' }}
            >
              {headingText}
            </h1>
            {cat && CAT_COPY[cat] && (
              <p className="mt-2 max-w-md font-sans text-[0.92rem] font-light text-blush/70">
                {CAT_COPY[cat]}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className={`${pageWrap} mb-6 pt-10 md:mb-8 md:pt-12 lg:pt-14`}>
          <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            {query ? 'Search' : 'Shop'}
          </p>
          <h1
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
          >
            {headingText}
          </h1>
        </div>
      )}

      <div className={`${pageWrap} pb-16 md:pb-20`}>
        <Suspense>
          <CollectionChips />
        </Suspense>

        <div className="flex gap-6 lg:gap-10">
          <Suspense>
            <FilterSidebar />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense>
              <SortBar total={total} cols={cols} onColsChange={setCols} />
            </Suspense>

            {initialProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-serif text-[1.5rem] font-light text-deep mb-3">
                  Nothing in this cut.
                </p>
                <p className="font-sans text-[0.86rem] text-mauve mb-6">
                  Try another word, or start from the full collection.
                </p>
                <Link
                  href="/shop"
                  className="font-sans text-[0.78rem] tracking-btn uppercase underline underline-offset-4 text-deep"
                >
                  View all
                </Link>
              </div>
            ) : initialProducts.length > 8 ? (
              <>
                <ProductGrid products={first8} cols={cols} />
                <BuilderPromoBanner />
                <ProductGrid products={rest} cols={cols} />
              </>
            ) : (
              <ProductGrid products={initialProducts} cols={cols} />
            )}

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
