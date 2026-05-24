'use client'

import { useBuilderStore } from '@/store/builderStore'
import { BraSVG } from './BraSVG'
import { formatPrice } from '@/lib/utils'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

const STEP_LABELS = ['Size', 'Type', 'Style', 'Fabric', 'Review']

interface ProductPreviewProps {
  currentStep: number
}

export function ProductPreview({ currentStep }: ProductPreviewProps) {
  const { braType, color, fabric, padding, strapStyle, band, cup, price } = useBuilderStore()

  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const bgColor = selectedColor?.color ?? '#EDE9E4'
  const isDark = ['deep', 'black', 'slate', 'mauve'].includes(color ?? '')

  const size = band && cup ? `${band}${cup}` : '—'

  return (
    <div className="flex flex-col h-full">
      {/* Preview area */}
      <div
        className="flex-1 rounded-card flex flex-col items-center justify-center p-8 transition-colors duration-500 min-h-[280px]"
        style={{ background: `linear-gradient(160deg, ${bgColor}20 0%, ${bgColor}60 100%)`, backgroundColor: bgColor + '18' }}
      >
        <div className="w-48 h-36">
          <BraSVG
            braType={braType}
            color={color}
            fabric={fabric}
            padding={padding}
            strapStyle={strapStyle}
          />
        </div>

        {/* Color swatch */}
        {color && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-lm"
              style={{ background: bgColor }}
            />
            <span className="font-sans text-[0.65rem] tracking-label uppercase"
              style={{ color: isDark ? bgColor : '#6B6058' }}>
              {selectedColor?.label ?? color}
            </span>
          </div>
        )}
      </div>

      {/* Spec summary */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            Custom Bra
          </span>
          <span className="font-serif text-[1.1rem] font-light text-deep">
            {formatPrice(price)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-lm">
          {[
            { label: 'Size', value: size },
            { label: 'Type', value: braType ?? '—' },
            { label: 'Fabric', value: fabric ?? '—' },
            { label: 'Colour', value: selectedColor?.label ?? '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans text-[0.58rem] tracking-label uppercase text-mauve">{label}</p>
              <p className="font-sans text-[0.72rem] capitalize text-deep mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step progress dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {STEP_LABELS.map((_, i) => (
          <span
            key={i}
            className="block transition-all duration-200"
            style={{
              width: i + 1 === currentStep ? 16 : 6,
              height: 4,
              borderRadius: 2,
              background: i + 1 <= currentStep ? '#0F0D0B' : '#D8D4CE',
            }}
          />
        ))}
      </div>
    </div>
  )
}
