'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

interface SizeSelectorProps {
  available: string[]
  selected: string
  onSelect: (size: string) => void
}

const STANDARD_SIZES = new Set([
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
])

function splitSize(size: string) {
  const band = size.match(/^\d+/)?.[0] ?? ''
  const cup = size.slice(band.length)
  return { band, cup }
}

export function SizeSelector({ available, selected, onSelect }: SizeSelectorProps) {
  const sizes = useMemo(
    () => available.filter((s) => STANDARD_SIZES.has(s)),
    [available]
  )

  const bands = useMemo(
    () => [...new Set(sizes.map((s) => splitSize(s).band))],
    [sizes]
  )

  const selectedParts = selected ? splitSize(selected) : null
  const [band, setBand] = useState(selectedParts?.band ?? bands[0] ?? '')

  useEffect(() => {
    if (selectedParts?.band) setBand(selectedParts.band)
  }, [selectedParts?.band])

  const cups = sizes
    .filter((s) => splitSize(s).band === band)
    .map((s) => splitSize(s).cup)

  function pickBand(next: string) {
    setBand(next)
    const cup = selectedParts?.cup
    const nextSize = cup ? `${next}${cup}` : ''
    if (nextSize && sizes.includes(nextSize)) onSelect(nextSize)
    else onSelect('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-2">Band</p>
        <div className="flex flex-wrap gap-2">
          {bands.map((b) => {
            const viewing = band === b
            const locked = selectedParts?.band === b
            return (
              <button
                key={b}
                type="button"
                onClick={() => pickBand(b)}
                className={cn(
                  'h-9 min-w-[44px] px-3 rounded-pill font-sans text-[0.76rem] border transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97]',
                  locked
                    ? 'border-deep bg-deep text-blush'
                    : viewing
                      ? 'border-deep text-deep'
                      : 'border-lm bg-transparent text-deep hover:border-mauve'
                )}
              >
                {b}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-2">Cup</p>
        <div className="flex flex-wrap gap-2">
          {cups.map((cup) => {
            const size = `${band}${cup}`
            const isSelected = selected === size
            return (
              <button
                key={cup}
                type="button"
                onClick={() => onSelect(size)}
                className={cn(
                  'h-9 min-w-[44px] px-3 rounded-pill font-sans text-[0.76rem] border transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97]',
                  isSelected
                    ? 'border-deep bg-deep text-blush'
                    : 'border-lm bg-transparent text-deep hover:border-mauve'
                )}
              >
                {cup}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
