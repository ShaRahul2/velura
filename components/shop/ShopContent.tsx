'use client'

import { useState, Suspense } from 'react'
import type { Product, ProductCategory } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const addToCart = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

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
      <div className="mb-10 lg:mb-12 2xl:mb-16">
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

      <div className="flex gap-10 lg:gap-12 2xl:gap-16">
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
              <ProductGrid products={first6} cols={cols} onQuickView={setQuickViewProduct} />
              <BuilderPromoBanner />
              <ProductGrid products={rest} cols={cols} onQuickView={setQuickViewProduct} />
            </>
          ) : (
            <ProductGrid products={initialProducts} cols={cols} onQuickView={setQuickViewProduct} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>

      {/* Quick View Modal — React powered for better UX */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/60 p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-cream max-w-md w-full rounded-card p-6 shadow-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-serif text-xl font-light text-deep">{quickViewProduct.name}</h3>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-mauve hover:text-deep text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="aspect-[4/3] relative rounded-card overflow-hidden mb-4 bg-blush">
              <img
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-sans text-sm text-mauve mb-2">{quickViewProduct.story}</p>
            <p className="font-sans text-lg text-deep mb-4">{formatPrice(quickViewProduct.price)}</p>

            <button
              onClick={() => {
                addToCart({
                  id: quickViewProduct.id,
                  name: quickViewProduct.name,
                  price: quickViewProduct.price,
                  qty: 1,
                  size: quickViewProduct.sizes.split('–')[0] || 'M',
                  emoji: quickViewProduct.emoji,
                  images: quickViewProduct.images,
                })
                addToast('Added to bag')
                openCart()
                setQuickViewProduct(null)
              }}
              className="w-full h-10 font-sans text-sm tracking-btn uppercase bg-deep text-blush rounded-btn hover:tracking-wide transition-all"
            >
              Add to Bag
            </button>

            <p className="text-center mt-3 text-xs text-mauve">Sizes: {quickViewProduct.sizes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
