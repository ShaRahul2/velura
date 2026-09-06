import Link from 'next/link'
import type { ProductCategory } from '@/types'
import { cn } from '@/lib/utils'
import { shopHref, type ShopQuery } from '@/lib/shopQuery'

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'pushup', label: 'Push-Up' },
  { id: 'lace', label: 'Lace' },
  { id: 'sports', label: 'Sports' },
  { id: 'seamless', label: 'Seamless' },
  { id: 'plus', label: 'Plus' },
  { id: 'bridal', label: 'Bridal' },
]

export function CollectionChips({ query }: { query: ShopQuery }) {
  const activeCat = query.cat ?? 'all'

  return (
    <div className="scrollbar-none -mx-5 mb-6 overflow-x-auto px-5 md:mx-0 md:mb-8 md:px-0">
      <div
        role="tablist"
        aria-label="Collections"
        className="flex min-w-max gap-6 border-b border-lm pb-px"
      >
        {CATEGORIES.map(({ id, label }) => {
          const active = activeCat === id
          return (
            <Link
              key={id}
              href={shopHref(query, { cat: id === 'all' ? '' : id })}
              scroll={false}
              prefetch
              role="tab"
              aria-selected={active}
              className={cn(
                '-mb-px inline-flex h-11 items-center border-b font-sans text-[0.72rem] tracking-btn uppercase transition-colors duration-150',
                active
                  ? 'border-deep text-deep'
                  : 'border-transparent text-mauve hover:text-deep'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
