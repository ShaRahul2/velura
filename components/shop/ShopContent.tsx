'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Product, ProductCategory } from '@/types'
import { pageWrap } from '@/lib/utils'
import { ITEMS_PER_PAGE } from '@/lib/products'
import { filterShopCatalog, paginateShop, parseShopQuery } from '@/lib/shopQuery'
import { ProductGrid } from './ProductGrid'
import { FilterSidebar } from './FilterSidebar'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'
import { Pagination } from './Pagination'
import { CollectionChips } from './CollectionChips'

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
  catalog: Product[]
}

export function ShopContent({ catalog }: ShopContentProps) {
  const searchParams = useSearchParams()
  const [hydrated, setHydrated] = useState(false)
  const [cols, setCols] = useState<2 | 3 | 4>(4)
  const searchKey = searchParams.toString()

  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const query = useMemo(
    () => (hydrated ? parseShopQuery(new URLSearchParams(searchKey)) : { page: 1 }),
    [hydrated, searchKey]
  )

  const filtered = useMemo(() => filterShopCatalog(catalog, query), [catalog, query])
  const paged = useMemo(
    () => paginateShop(filtered, query.page, ITEMS_PER_PAGE),
    [filtered, query.page]
  )

  const { data: initialProducts, total, page: currentPage, totalPages } = paged
  const cat = query.cat as ProductCategory | undefined
  const searchQ = query.q

  const headingText = searchQ
    ? `Results for “${searchQ}”`
    : cat
      ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}`
      : 'The collection.'

  const first8 = initialProducts.slice(0, 8)
  const rest = initialProducts.slice(8)
  const showBanner = Boolean(cat && !searchQ)

  return (
    <div>
      {showBanner ? (
        <div className="relative mb-10 h-[38vh] min-h-[240px] max-h-[420px] overflow-hidden bg-deep md:mb-14 md:h-[46vh]">
          <Image
            src={`/images/categories/${cat}.jpg`}
            alt=""
            fill
            sizes="100vw"
            priority
            quality={70}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/15 to-transparent" />
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
            {searchQ ? 'Search' : 'Shop'}
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

        <div className="flex gap-8 lg:gap-12">
          <Suspense>
            <FilterSidebar />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense>
              <SortBar total={total} cols={cols} onColsChange={setCols} />
            </Suspense>

            {initialProducts.length === 0 ? (
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
            ) : initialProducts.length > 8 ? (
              <>
                <ProductGrid products={first8} cols={cols} priorityCount={4} />
                <BuilderPromoBanner />
                <ProductGrid products={rest} cols={cols} />
              </>
            ) : (
              <ProductGrid products={initialProducts} cols={cols} priorityCount={4} />
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
