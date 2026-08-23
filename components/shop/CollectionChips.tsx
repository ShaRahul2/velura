'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { ProductCategory } from '@/types'
import { cn } from '@/lib/utils'

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

export function CollectionChips() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCat = searchParams.get('cat') ?? 'all'

  function setCat(id: ProductCategory | 'all') {
    const params = new URLSearchParams(searchParams.toString())
    if (id === 'all') params.delete('cat')
    else params.set('cat', id)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `/shop?${qs}` : '/shop')
  }

  return (
    <div className="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto mb-6 md:mb-8 scrollbar-none">
      <div className="flex gap-2 min-w-max pb-1">
        {CATEGORIES.map(({ id, label }) => {
          const active = activeCat === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCat(id)}
              className={cn(
                'h-9 px-4 rounded-pill font-sans text-[0.72rem] tracking-btn uppercase border transition-colors duration-150',
                active
                  ? 'bg-deep text-blush border-deep'
                  : 'bg-transparent text-mauve border-lm hover:border-deep hover:text-deep'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
