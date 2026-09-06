import Image from 'next/image'
import type { Product, ProductCategory } from '@/types'
import { pageWrap } from '@/lib/utils'
import type { ShopQuery } from '@/lib/shopQuery'
import { CollectionChips } from './CollectionChips'
import { FilterSidebar } from './FilterSidebar'
import { ShopResults } from './ShopResults'

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
  products: Product[]
  total: number
  page: number
  totalPages: number
  query: ShopQuery
}

export function ShopContent({ products, total, page, totalPages, query }: ShopContentProps) {
  const cat = query.cat as ProductCategory | undefined
  const searchQ = query.q
  const showBanner = Boolean(cat && !searchQ)

  const headingText = searchQ
    ? `Results for “${searchQ}”`
    : cat
      ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}`
      : 'The collection.'

  return (
    <div>
      {showBanner ? (
        <div className="relative mb-8 h-[200px] overflow-hidden bg-deep md:mb-12 md:h-[260px] lg:h-[300px]">
          <Image
            src={`/images/categories/${cat}.jpg`}
            alt=""
            fill
            sizes="100vw"
            priority
            quality={60}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/75 via-deep/20 to-transparent" />
          <div className={`relative z-10 flex h-full flex-col justify-end ${pageWrap} pb-7 md:pb-10`}>
            <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
              Collection
            </p>
            <h1 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-light tracking-[-0.02em] text-blush">
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
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-light tracking-[-0.02em] text-deep">
            {headingText}
          </h1>
        </div>
      )}

      <div className={`${pageWrap} pb-16 md:pb-20`}>
        <CollectionChips query={query} />

        <div className="flex gap-8 lg:gap-12">
          <FilterSidebar query={query} />

          <div className="min-w-0 flex-1">
            <ShopResults
              products={products}
              total={total}
              page={page}
              totalPages={totalPages}
              query={query}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
