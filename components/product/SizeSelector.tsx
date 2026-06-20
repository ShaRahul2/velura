'use client'

import { cn } from '@/lib/utils'

const STANDARD_SIZES = [
  '28AA','28A','28B','28C','28D',
  '30AA','30A','30B','30C','30D','30DD',
  '32AA','32A','32B','32C','32D','32DD','32DDD',
  '34A','34B','34C','34D','34DD','34DDD','34F',
  '36A','36B','36C','36D','36DD','36DDD','36F','36G',
  '38B','38C','38D','38DD','38DDD','38F','38G',
  '40C','40D','40DD','40DDD','40F','40G','40H',
  '42D','42DD','42DDD','42F','42G','42H',
  '44DD','44DDD','44F','44G','44H',
  '46DD','46DDD','46F','46G','46H',
  '48F','48G','48H',
  '50G','50H',
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
              'h-9 lg:h-10 2xl:h-11 min-w-[52px] lg:min-w-[56px] 2xl:min-w-[60px] px-3 rounded-pill font-sans text-[0.76rem] lg:text-[0.8rem] 2xl:text-[0.85rem] border transition-all duration-150',
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
