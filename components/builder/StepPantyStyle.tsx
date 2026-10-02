'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_PANTY_SIZES, CB_PANTY_STYLES } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'
import { PantySVG } from './PantySVG'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

export function StepPantyStyle() {
  const { pantyStyle, pantySize, setPantyStyle, setPantySize, color } = useBuilderStore()
  const dye = CB_COLOR_OPTIONS.find((entry) => entry.id === color)?.color ?? '#EDE9E4'

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Choose the cut</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">Five cuts. XS to 4XL.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-5">
        {CB_PANTY_STYLES.map((style) => {
          const selected = pantyStyle === style.id
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setPantyStyle(style.id)}
              className="text-left px-2 py-2 transition-all duration-200"
              style={{
                borderRadius: 4,
                border: `1px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                background: selected ? 'rgba(15,13,11,0.04)' : 'transparent',
              }}
            >
              <div className="h-16 mb-1 flex items-center justify-center">
                <div className="w-[56px] h-[64px]">
                  <PantySVG styleId={style.id} color={dye} />
                </div>
              </div>
              <p className="font-serif text-[0.9rem] font-light text-deep leading-tight">{style.label}</p>
              <p className="font-sans text-[0.62rem] text-mauve mt-0.5">{style.description}</p>
              {style.price > 0 && (
                <p className="font-sans text-[0.55rem] text-mauve mt-1">+{formatPrice(style.price)}</p>
              )}
            </button>
          )
        })}
      </div>

      <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-2">Size</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
        {CB_PANTY_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setPantySize(size)}
            className="h-9 w-full font-sans text-[0.76rem] transition-all duration-150 rounded-pill"
            style={{
              background: pantySize === size ? '#0F0D0B' : 'transparent',
              color: pantySize === size ? '#EDE9E4' : '#0F0D0B',
              border: pantySize === size ? '1px solid #0F0D0B' : '1px solid #D8D4CE',
            }}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
