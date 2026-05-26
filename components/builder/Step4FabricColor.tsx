'use client'

import { useBuilderStore } from '@/store/builderStore'
import { CB_FABRIC_OPTIONS, CB_COLOR_OPTIONS } from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'

// IDs where a white outline is needed (fill is too close to page bg)
const LIGHT_IDS = new Set(['ivory', 'blush', 'cream', 'nude', 'champagne'])

export function Step4FabricColor() {
  const { fabric, setFabric, color, setColor } = useBuilderStore()

  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)

  return (
    <div>
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Fabric & colour</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">Choose what it feels like and what it looks like.</p>

      {/* ── Fabric ─────────────────────────────────────────── */}
      <div className="mb-7">
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

      {/* ── Colour ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve">Colour</p>
          {selectedColor && (
            <span
              className="font-sans text-[0.65rem] tracking-label uppercase transition-all duration-200"
              style={{ color: '#0F0D0B' }}
            >
              {selectedColor.label}
            </span>
          )}
        </div>

        {/* ── Neutral row ── */}
        <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve opacity-60 mb-2">Neutrals</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {CB_COLOR_OPTIONS.filter((c) =>
            ['ivory','blush','nude','cream','champagne','rose','smoke','mauve','slate','deep','black'].includes(c.id)
          ).map((opt) => (
            <ColorSwatch
              key={opt.id}
              opt={opt}
              selected={color === opt.id}
              isLight={LIGHT_IDS.has(opt.id)}
              onSelect={setColor}
            />
          ))}
        </div>

        {/* ── Pinks & Reds row ── */}
        <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve opacity-60 mb-2">Pinks & Reds</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {CB_COLOR_OPTIONS.filter((c) =>
            ['pink','blushrose','red','burgundy'].includes(c.id)
          ).map((opt) => (
            <ColorSwatch
              key={opt.id}
              opt={opt}
              selected={color === opt.id}
              isLight={LIGHT_IDS.has(opt.id)}
              onSelect={setColor}
            />
          ))}
        </div>

        {/* ── Blues & Greens row ── */}
        <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve opacity-60 mb-2">Blues & Greens</p>
        <div className="flex flex-wrap gap-3">
          {CB_COLOR_OPTIONS.filter((c) =>
            ['lavender','navy','cobalt','sage','forest'].includes(c.id)
          ).map((opt) => (
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
      className="flex flex-col items-center gap-1 transition-all duration-150"
    >
      <span
        className="block transition-all duration-150"
        style={{
          width:         36,
          height:        36,
          borderRadius:  '50%',
          background:    opt.color,
          // Light colors: dark ring for visibility; dark colors: white ring
          border:        selected
            ? `2.5px solid ${isLight ? '#0F0D0B' : opt.color}`
            : `2px solid transparent`,
          outline:       selected
            ? `2px solid ${isLight ? '#0F0D0B' : opt.color}`
            : `2px solid ${isLight ? '#D8D4CE' : 'transparent'}`,
          outlineOffset: selected ? '2px' : '0px',
          boxShadow:     isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : 'none',
          transform:     selected ? 'scale(1.15)' : 'scale(1)',
        }}
      />
      <span
        className="font-sans text-[0.55rem] tracking-label uppercase text-center leading-tight"
        style={{
          color:      selected ? '#0F0D0B' : '#9A8878',
          maxWidth:   40,
          whiteSpace: 'nowrap',
          overflow:   'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {opt.label}
      </span>
    </button>
  )
}
