'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_BRA_TYPES } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'

const ICONS: Record<string, string> = {
  everyday:   '☁️',
  balconette: '✨',
  padded:     '💫',
  sports:     '🏋️‍♀️',
  lace:       '🌸',
  wirefree:   '🪶',
  strapless:  '🌙',
  bridal:     '🤍',
  tshirt:     '◯',
  pushup:     '↗',
  plunge:     '◇',
  minimizer:  '◎',
}

export function Step2BraType() {
  const { braType, setBraType } = useBuilderStore()

  return (
    <div>
      <h3 className="font-serif text-[1.1rem] lg:text-[1.2rem] font-light text-deep mb-px">Choose your bra type</h3>
      <p className="font-sans text-[0.6rem] text-mauve mb-1.5">Shape &amp; support that suits you.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1">
        {CB_BRA_TYPES.map((type) => {
          const selected = braType === type.id
          return (
            <button
              key={type.id}
              onClick={() => setBraType(type.id)}
              className="text-left p-1 transition-all duration-200"
              style={{
                borderRadius: 3,
                border: `1px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                background:   selected ? 'rgba(15,13,11,0.04)' : 'transparent',
              }}
            >
              <div className="flex items-start justify-between mb-px">
                <span className="text-sm leading-none">{ICONS[type.id] ?? '✦'}</span>
                {type.price > 0 && (
                  <span
                    className="font-sans text-[0.5rem] tracking-label uppercase px-1 py-px"
                    style={{ borderRadius: 2, background: '#EDE9E4', color: '#6B6058' }}
                  >
                    +{formatPrice(type.price)}
                  </span>
                )}
              </div>
              <p className="font-serif text-[0.76rem] font-light text-deep leading-tight">{type.label}</p>
              <p className="font-sans text-[0.49rem] text-mauve leading-snug line-clamp-2">{type.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
