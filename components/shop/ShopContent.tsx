'use client'

import { useRef, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, ProductCategory } from '@/types'
import { formatPrice, pageWrap } from '@/lib/utils'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { ProductGrid } from './ProductGrid'
import { FilterSidebar } from './FilterSidebar'
import { SortBar } from './SortBar'
import { BuilderPromoBanner } from './BuilderPromoBanner'
import { Pagination } from './Pagination'
import { CollectionChips } from './CollectionChips'
import { describeProductImage } from '@/lib/productDescribe'

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
  const [cols, setCols] = useState<2 | 3 | 4>(3)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const quickViewRef = useRef<HTMLDivElement>(null)
  useFocusTrap(Boolean(quickViewProduct), quickViewRef, () => setQuickViewProduct(null))

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const cat = currentCat as ProductCategory | undefined

  const headingText = query
    ? `Results for “${query}”`
    : cat
      ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}`
      : 'The collection.'

  const first6 = initialProducts.slice(0, 6)
  const rest = initialProducts.slice(6)
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
        <div className={`${pageWrap} mb-8 pt-12 md:mb-10 md:pt-16 lg:pt-20`}>
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

        <div className="flex gap-8 lg:gap-12">
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
      </div>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/55 p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            ref={quickViewRef}
            className="modal-panel bg-cream max-w-2xl w-full overflow-hidden shadow-overlay grid md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${quickViewProduct.name}`}
          >
            <div className="relative aspect-[3/4] bg-blush">
              <Image
                src={quickViewProduct.images[0]}
                alt={describeProductImage(quickViewProduct, { shot: 'front' })}
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
                  type="button"
                  onClick={() => setQuickViewProduct(null)}
                  className="text-mauve hover:text-deep text-xl leading-none p-3"
                  aria-label="Close quick view"
                >
                  ×
                </button>
              </div>
              <p className="font-sans text-sm text-mauve mb-3">{quickViewProduct.story}</p>
              <p className="font-sans text-lg text-deep mb-6">
                {formatPrice(quickViewProduct.price)}
              </p>
              <Link
                href={`/shop/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="pressable pressable-track w-full h-11 flex items-center justify-center font-sans text-sm tracking-btn uppercase bg-deep text-blush rounded-btn"
              >
                Choose size
              </Link>
              <p className="text-center mt-4 text-xs text-mauve">
                Sizes: {quickViewProduct.sizes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
