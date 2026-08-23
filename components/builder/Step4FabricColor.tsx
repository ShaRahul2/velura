'use client'

import { useBuilderStore } from '@/store/builderStore'
import {
  CB_FABRIC_OPTIONS,
  CB_COLOR_OPTIONS,
  CB_COLOR_GROUPS,
  isLightColor,
} from '@/data/builderOptions'
import { formatPrice, cn } from '@/lib/utils'

export function Step4FabricColor() {
  const { fabric, setFabric, color, setColor } = useBuilderStore()
  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Fabric &amp; colour</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">
        Nine fabrics. {CB_COLOR_OPTIONS.length} colours. The preview takes the dye immediately.
      </p>

      <div className="mb-5">
        <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-3">Fabric</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CB_FABRIC_OPTIONS.map((opt) => {
            const selected = fabric === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setFabric(opt.id)}
                className="text-left px-3 py-2.5 transition-all duration-150"
                style={{
                  borderRadius: 4,
                  border: `1px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                  background: selected ? 'rgba(15,13,11,0.04)' : 'transparent',
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-sans text-[0.82rem] text-deep">{opt.label}</span>
                  <span className="font-sans text-[0.62rem] text-mauve shrink-0">
                    {opt.price > 0 ? `+${formatPrice(opt.price)}` : 'Inc'}
                  </span>
                </div>
                <p className="font-sans text-[0.68rem] text-mauve mt-0.5">{opt.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve">Colour</p>
          {selectedColor && (
            <span className="font-sans text-[0.68rem] tracking-label uppercase text-deep">
              {selectedColor.label}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {CB_COLOR_GROUPS.map((group) => (
            <div key={group}>
              <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {CB_COLOR_OPTIONS.filter((c) => c.group === group).map((opt) => {
                  const selected = color === opt.id
                  const light = isLightColor(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setColor(opt.id)}
                      title={opt.label}
                      aria-label={opt.label}
                      aria-pressed={selected}
                      className="flex items-center justify-center"
                    >
                      <span
                        className={cn('block transition-transform duration-150')}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: opt.color,
                          boxShadow: light ? 'inset 0 0 0 1px rgba(15,13,11,0.12)' : 'none',
                          outline: selected ? '1.5px solid #0F0D0B' : '1px solid transparent',
                          outlineOffset: 2,
                          transform: selected ? 'scale(1.08)' : 'scale(1)',
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
