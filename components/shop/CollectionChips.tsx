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
    <div className="scrollbar-none -mx-5 mb-6 overflow-x-auto px-5 md:mx-0 md:mb-7 md:px-0">
      <div className="flex min-w-max gap-6 border-b border-lm pb-px">
        {CATEGORIES.map(({ id, label }) => {
          const active = activeCat === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCat(id)}
              className={cn(
                '-mb-px h-11 border-b font-sans text-[0.72rem] tracking-btn uppercase transition-colors duration-150',
                active
                  ? 'border-deep text-deep'
                  : 'border-transparent text-mauve hover:text-deep'
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
