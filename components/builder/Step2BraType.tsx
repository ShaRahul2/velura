'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_BRA_TYPES, TYPE_DEFAULTS } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'
import { BraSVG } from './BraSVG'
import type { BuilderVisualSpec } from '@/lib/builderVisualSpec'

function typeSpec(typeId: string, colorId: string): BuilderVisualSpec {
  const d = TYPE_DEFAULTS[typeId] ?? {}
  return {
    braType:    typeId,
    strapStyle: typeId === 'strapless' ? 'none' : (d.strapStyle ?? 'classic'),
    padding:    d.padding    ?? 'none',
    underwire:  d.underwire  ?? 'wired',
    closure:    d.closure    ?? 'back',
    support:    d.support    ?? 'medium',
    fabric:     d.fabric     ?? 'cotton',
    colorId,
    colorLabel: '',
    colorHex:   '',
    size:       '—',
  }
}

export function Step2BraType() {
  const { braType, setBraType, color } = useBuilderStore()
  const colorId = color ?? 'cream'

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Choose your silhouette</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">Eighteen cuts. The diagram follows your pick.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
        {CB_BRA_TYPES.map((type) => {
          const selected = braType === type.id
          return (
            <button
              key={type.id}
              onClick={() => setBraType(type.id)}
              className="text-left px-2 py-2 transition-all duration-200"
              style={{
                borderRadius: 4,
                border: `1px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                background: selected ? 'rgba(15,13,11,0.04)' : 'transparent',
              }}
            >
              <div className="h-12 mb-1 flex items-center justify-center">
                <div className="w-[72px] h-[48px]">
                  <BraSVG spec={typeSpec(type.id, colorId)} />
                </div>
              </div>
              <p className="font-serif text-[0.82rem] font-light text-deep leading-tight truncate">
                {type.label}
              </p>
              {type.price > 0 && (
                <p className="font-sans text-[0.55rem] text-mauve">+{formatPrice(type.price)}</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
