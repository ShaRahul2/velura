'use client'

import { cn } from '@/lib/utils'

const STANDARD_SIZES = [
  '28A','28B','28C','28D',
  '30A','30B','30C','30D','30DD',
  '32A','32B','32C','32D','32DD',
  '34A','34B','34C','34D','34DD',
  '36A','36B','36C','36D','36DD',
  '38B','38C','38D','38DD',
  '40C','40D','40DD',
  '42D','42DD',
  '44DD',
]

interface SizeSelectorProps {
  available: string[]
  selected: string
  onSelect: (size: string) => void
}

export function SizeSelector({ available, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STANDARD_SIZES.filter((s) => available.includes(s)).map((size) => {
        const isSelected = selected === size
        return (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              'h-9 min-w-[52px] px-3 rounded-pill font-sans text-[0.76rem] border transition-all duration-150',
              isSelected
                ? 'border-deep bg-deep text-blush'
                : 'border-lm bg-transparent text-deep hover:border-mauve'
            )}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
