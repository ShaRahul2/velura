'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LayoutGrid, Grid3x3, Square, SlidersHorizontal } from 'lucide-react'
import { FilterDrawer } from './FilterDrawer'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: '',           label: 'Featured' },
  { value: 'rating',     label: 'Top rated' },
  { value: 'price-asc',  label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'new',        label: 'New arrivals' },
]

interface SortBarProps {
  total:        number
  cols:         2 | 3 | 4
  onColsChange: (c: 2 | 3 | 4) => void
}

export function SortBar({ total, cols, onColsChange }: SortBarProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const activeSort   = searchParams.get('sort') ?? ''
  const [filterOpen, setFilterOpen] = useState(false)

  const activeFilterCount = [searchParams.get('cat'), searchParams.get('support')]
    .filter(Boolean).length

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === '') params.delete('sort')
    else params.set('sort', value)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `/shop?${qs}` : '/shop')
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-lm pb-3">
        <div className="flex items-center gap-3">
          <p className="font-sans text-[0.78rem] text-mauve">
            {total} {total === 1 ? 'piece' : 'pieces'}
          </p>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1.5 font-sans text-[0.72rem] tracking-btn uppercase text-mauve md:hidden"
          >
            <SlidersHorizontal size={13} />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-deep font-sans text-[0.55rem] text-blush">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={activeSort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="max-w-[7.5rem] cursor-pointer border-none bg-transparent text-right font-sans text-[0.72rem] text-deep outline-none sm:max-w-none sm:text-[0.78rem]"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="hidden items-center gap-0.5 md:flex">
            <button
              type="button"
              onClick={() => onColsChange(2)}
              className={cn('p-1.5', cols === 2 ? 'text-deep' : 'text-gold')}
              aria-label="2 columns"
              aria-pressed={cols === 2}
            >
              <Square size={15} />
            </button>
            <button
              type="button"
              onClick={() => onColsChange(3)}
              className={cn('p-1.5', cols === 3 ? 'text-deep' : 'text-gold')}
              aria-label="3 columns"
              aria-pressed={cols === 3}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onColsChange(4)}
              className={cn('hidden p-1.5 lg:block', cols === 4 ? 'text-deep' : 'text-gold')}
              aria-label="4 columns"
              aria-pressed={cols === 4}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      <Suspense>
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
      </Suspense>
    </>
  )
}
