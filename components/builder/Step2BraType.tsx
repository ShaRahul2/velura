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
}

export function Step2BraType() {
  const { braType, setBraType } = useBuilderStore()

  return (
    <div>
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Choose your bra type</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">The shape and support that suits you best.</p>

      <div className="grid grid-cols-2 gap-3">
        {CB_BRA_TYPES.map((type) => {
          const selected = braType === type.id
          return (
            <button
              key={type.id}
              onClick={() => setBraType(type.id)}
              className="text-left p-4 transition-all duration-200"
              style={{
                borderRadius: 4,
                border: `1.5px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                background:   selected ? 'rgba(15,13,11,0.04)' : 'transparent',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{ICONS[type.id] ?? '✦'}</span>
                {type.price > 0 && (
                  <span
                    className="font-sans text-[0.6rem] tracking-label uppercase px-1.5 py-0.5"
                    style={{ borderRadius: 2, background: '#EDE9E4', color: '#6B6058' }}
                  >
                    +{formatPrice(type.price)}
                  </span>
                )}
              </div>
              <p className="font-serif text-[0.95rem] font-light text-deep">{type.label}</p>
              <p className="font-sans text-[0.65rem] text-mauve mt-0.5 leading-snug">{type.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
