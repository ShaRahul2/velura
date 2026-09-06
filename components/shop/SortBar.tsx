'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid, Grid3x3, Square, SlidersHorizontal } from 'lucide-react'
import { FilterDrawer } from './FilterDrawer'
import { cn } from '@/lib/utils'
import { shopHref, type ShopQuery } from '@/lib/shopQuery'

const SORT_OPTIONS = [
  { value: '',           label: 'Featured' },
  { value: 'rating',     label: 'Top rated' },
  { value: 'price-asc',  label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'new',        label: 'New arrivals' },
]

interface SortBarProps {
  total: number
  cols: 2 | 3 | 4
  onColsChange: (c: 2 | 3 | 4) => void
  query: ShopQuery
}

export function SortBar({ total, cols, onColsChange, query }: SortBarProps) {
  const router = useRouter()
  const [filterOpen, setFilterOpen] = useState(false)
  const activeSort = query.sort ?? ''
  const activeFilterCount = [query.cat, query.support].filter(Boolean).length

  function setSort(value: string) {
    router.push(shopHref(query, { sort: value }))
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
            className="flex h-11 items-center gap-1.5 font-sans text-[0.72rem] tracking-btn uppercase text-mauve md:hidden"
          >
            <SlidersHorizontal size={13} aria-hidden="true" />
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
            className="h-11 max-w-[7.5rem] cursor-pointer border-none bg-transparent text-right font-sans text-[0.72rem] text-deep outline-none sm:max-w-none sm:text-[0.78rem]"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="hidden items-center gap-0.5 md:flex">
            <button
              type="button"
              onClick={() => onColsChange(2)}
              className={cn('flex h-11 w-11 items-center justify-center', cols === 2 ? 'text-deep' : 'text-gold')}
              aria-label="2 columns"
              aria-pressed={cols === 2}
            >
              <Square size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onColsChange(3)}
              className={cn('flex h-11 w-11 items-center justify-center', cols === 3 ? 'text-deep' : 'text-gold')}
              aria-label="3 columns"
              aria-pressed={cols === 3}
            >
              <Grid3x3 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onColsChange(4)}
              className={cn('hidden h-11 w-11 items-center justify-center lg:flex', cols === 4 ? 'text-deep' : 'text-gold')}
              aria-label="4 columns"
              aria-pressed={cols === 4}
            >
              <LayoutGrid size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} query={query} />
    </>
  )
}
