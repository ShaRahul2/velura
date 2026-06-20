'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_FABRIC_OPTIONS, CB_COLOR_OPTIONS } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'

// IDs where a white outline is needed (fill is too close to page bg)
const LIGHT_IDS = new Set(['ivory', 'blush', 'cream', 'nude', 'champagne', 'sky', 'mint', 'lilac', 'sand', 'peach', 'periwinkle', 'stone'])

const COLOR_GROUPS = [
  { label: 'Neutrals', ids: ['ivory','blush','nude','cream','champagne','rose','smoke','mauve','slate','deep','black','sand','stone','charcoal','mocha'] },
  { label: 'Pinks & Reds', ids: ['pink','blushrose','red','burgundy','coral','terracotta','peach','fuchsia','rosewood'] },
  { label: 'Blues & Greens', ids: ['lavender','navy','cobalt','sage','forest','sky','teal','mint','olive','periwinkle','emerald'] },
  { label: 'Rich tones', ids: ['lilac','plum','mustard','chocolate','amethyst'] },
] as const

export function Step4FabricColor() {
  const { fabric, setFabric, color, setColor } = useBuilderStore()

  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)

  return (
    <div>
      <h3 className="font-serif text-[1.1rem] lg:text-[1.2rem] font-light text-deep mb-px">Fabric &amp; colour</h3>
      <p className="font-sans text-[0.6rem] text-mauve mb-1.5">Five fabrics. Forty colours.</p>

      {/* ── Fabric ─────────────────────────────────────────── */}
      <div className="mb-2">
        <p className="font-sans text-[0.52rem] tracking-label uppercase text-mauve mb-1">Fabric</p>
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-1">
          {CB_FABRIC_OPTIONS.map((opt) => {
            const selected = fabric === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setFabric(opt.id)}
                className="flex items-center justify-between px-2 h-7 text-left transition-all duration-150"
                style={{
                  borderRadius: 3,
                  border:      `1px solid ${selected ? '#0F0D0B' : '#D8D4CE'}`,
                  background:   selected ? 'rgba(15,13,11,0.04)' : 'transparent',
                }}
              >
                <span className="font-sans text-[0.6rem] text-deep">{opt.label}</span>
                {opt.price > 0 ? (
                  <span className="font-sans text-[0.52rem] text-mauve">+{formatPrice(opt.price)}</span>
                ) : (
                  <span className="font-sans text-[0.5rem] text-mauve opacity-60">Inc</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Colour ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="font-sans text-[0.52rem] tracking-label uppercase text-mauve">Colour</p>
          {selectedColor && (
            <span className="font-sans text-[0.55rem] tracking-label uppercase text-deep">
              {selectedColor.label}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="font-sans text-[0.46rem] tracking-label uppercase text-mauve opacity-60 mb-0.5">{group.label}</p>
              <div className="flex flex-wrap gap-1">
                {CB_COLOR_OPTIONS.filter((c) => group.ids.includes(c.id as never)).map((opt) => (
                  <ColorSwatch
                    key={opt.id}
                    opt={opt}
                    selected={color === opt.id}
                    isLight={LIGHT_IDS.has(opt.id)}
                    onSelect={setColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Reusable swatch ───────────────────────────────────────────────────────────

interface SwatchProps {
  opt:      { id: string; label: string; color: string }
  selected: boolean
  isLight:  boolean
  onSelect: (id: string) => void
}

function ColorSwatch({ opt, selected, isLight, onSelect }: SwatchProps) {
  return (
    <button
      onClick={() => onSelect(opt.id)}
      title={opt.label}
      aria-label={opt.label}
      aria-pressed={selected}
      className="flex items-center justify-center transition-all duration-150"
    >
      <span
        className="block transition-all duration-150"
        style={{
          width:         19,
          height:        19,
          borderRadius:  '50%',
          background:    opt.color,
          border:        selected
            ? `2px solid ${isLight ? '#0F0D0B' : opt.color}`
            : `1.5px solid transparent`,
          outline:       selected
            ? `1px solid ${isLight ? '#0F0D0B' : opt.color}`
            : `1px solid ${isLight ? '#D8D4CE' : 'transparent'}`,
          outlineOffset: selected ? '1px' : '0px',
          boxShadow:     isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : 'none',
          transform:     selected ? 'scale(1.12)' : 'scale(1)',
        }}
      />
    </button>
  )
}
