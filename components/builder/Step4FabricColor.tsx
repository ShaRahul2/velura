'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_FABRIC_OPTIONS, CB_COLOR_OPTIONS } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'

export function Step4FabricColor() {
  const { fabric, setFabric, color, setColor } = useBuilderStore()

  return (
    <div>
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Fabric & colour</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">Choose what it feels like and what it looks like.</p>

      {/* Fabric */}
      <div className="mb-6">
        <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-3">Fabric</p>
        <div className="grid grid-cols-1 gap-2">
          {CB_FABRIC_OPTIONS.map((opt) => {
            const selected = fabric === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setFabric(opt.id)}
                className="flex items-center justify-between p-3 text-left transition-all duration-150"
                style={{
                  borderRadius: 3,
                  border:      `1.5px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                  background:   selected ? 'rgba(15,13,11,0.04)' : 'transparent',
                }}
              >
                <span className="font-sans text-[0.82rem] text-deep">{opt.label}</span>
                {opt.price > 0 ? (
                  <span className="font-sans text-[0.65rem] text-mauve">+{formatPrice(opt.price)}</span>
                ) : (
                  <span className="font-sans text-[0.6rem] text-mauve opacity-60">Included</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Colour */}
      <div>
        <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-3">Colour</p>
        <div className="flex flex-wrap gap-3">
          {CB_COLOR_OPTIONS.map((opt) => {
            const selected = color === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setColor(opt.id)}
                title={opt.label}
                className="flex flex-col items-center gap-1 transition-all duration-150"
              >
                <span
                  className="w-9 h-9 rounded-full block transition-transform duration-150"
                  style={{
                    background:   opt.color,
                    border:       selected ? '2px solid #0F0D0B' : '2px solid transparent',
                    outline:      selected ? '2px solid #0F0D0B' : '2px solid #D8D4CE',
                    outlineOffset: selected ? '2px' : '0px',
                    transform:    selected ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                <span
                  className="font-sans text-[0.58rem] tracking-label uppercase"
                  style={{ color: selected ? '#0F0D0B' : '#9A8878' }}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
