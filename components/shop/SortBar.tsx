'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LayoutGrid, Grid3x3, SlidersHorizontal } from 'lucide-react'
import { FilterDrawer } from './FilterDrawer'

const SORT_OPTIONS = [
  { value: '',           label: 'Featured' },
  { value: 'rating',     label: 'Top rated' },
  { value: 'price-asc',  label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'new',        label: 'New arrivals' },
]

interface SortBarProps {
  total:         number
  cols:          2 | 3 | 4 | 5
  onColsChange:  (c: 2 | 3 | 4 | 5) => void
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
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-lm">
        <div className="flex items-center gap-3">
          <p className="font-sans text-[0.78rem] lg:text-[0.84rem] text-mauve">
            {total} {total === 1 ? 'piece' : 'pieces'}
          </p>

          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 font-sans text-[0.72rem] lg:text-[0.76rem] 2xl:text-[0.8rem] tracking-btn uppercase text-mauve"
          >
            <SlidersHorizontal size={13} />
            Filter
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center font-sans text-[0.55rem] text-blush"
                style={{ background: '#0F0D0B' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort select */}
          <select
            value={activeSort}
            onChange={(e) => setSort(e.target.value)}
            className="font-sans text-[0.78rem] lg:text-[0.84rem] text-deep bg-transparent border-none outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Col toggle — desktop only */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onColsChange(2)}
              className="p-1.5 rounded transition-colors"
              style={{ color: cols === 2 ? '#0F0D0B' : '#9A8878' }}
              aria-label="2 columns"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => onColsChange(3)}
              className="p-1.5 rounded transition-colors"
              style={{ color: cols === 3 ? '#0F0D0B' : '#9A8878' }}
              aria-label="3 columns"
            >
              <Grid3x3 size={15} />
            </button>
            <button
              onClick={() => onColsChange(4)}
              className="p-1.5 rounded transition-colors hidden xl:block"
              style={{ color: cols === 4 ? '#0F0D0B' : '#9A8878' }}
              aria-label="4 columns"
            >
              <Grid3x3 size={15} />
            </button>
            <button
              onClick={() => onColsChange(5)}
              className="p-1.5 rounded transition-colors hidden 2xl:block"
              style={{ color: cols === 5 ? '#0F0D0B' : '#9A8878' }}
              aria-label="5 columns"
            >
              <Grid3x3 size={15} />
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
