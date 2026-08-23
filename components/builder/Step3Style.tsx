'use client'

import { useBuilderStore } from '@/store/builderStore'
import {
  CB_STRAP_STYLES,
  CB_PADDING_OPTIONS,
  CB_UNDERWIRE_OPTIONS,
  CB_CLOSURE_OPTIONS,
  CB_SUPPORT_OPTIONS,
} from '@/data/builderOptions'
import { formatPrice } from '@/lib/utils'

interface OptionRowProps<T extends { id: string; label: string; price: number; description?: string }> {
  label: string
  hint?: string
  options: readonly T[]
  selected: string | null
  onSelect: (id: string) => void
}

function OptionRow<T extends { id: string; label: string; price: number; description?: string }>({
  label,
  hint,
  options,
  selected,
  onSelect,
}: OptionRowProps<T>) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve">{label}</p>
        {hint && <p className="font-sans text-[0.62rem] text-mauve">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              title={'description' in opt ? opt.description : undefined}
              className="h-9 px-3.5 font-sans text-[0.76rem] transition-all duration-150 flex items-center gap-1.5 rounded-btn"
              style={{
                background: active ? '#0F0D0B' : 'transparent',
                color:      active ? '#EDE9E4' : '#0F0D0B',
                border:     active ? '1px solid #0F0D0B' : '1px solid #D8D4CE',
              }}
            >
              {opt.label}
              {opt.price > 0 && (
                <span style={{ color: active ? 'rgba(237,233,228,0.65)' : '#9A8878', fontSize: '0.62rem' }}>
                  +{formatPrice(opt.price)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Step3Style() {
  const {
    braType,
    strapStyle, setStrapStyle,
    padding,    setPadding,
    underwire,  setUnderwire,
    closure,    setClosure,
    support,    setSupport,
  } = useBuilderStore()

  const strapless = braType === 'strapless'

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Style &amp; support</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">
        Tailor the construction. The diagram follows every choice.
      </p>

      <div className="space-y-3.5">
        {strapless ? (
          <div
            className="px-4 py-3 font-sans text-[0.8rem] text-mauve"
            style={{ border: '1px solid #D8D4CE', borderRadius: 4 }}
          >
            Strapless — no shoulder straps. Silicone grip is built in.
          </div>
        ) : (
          <OptionRow
            label="Straps"
            options={CB_STRAP_STYLES}
            selected={strapStyle}
            onSelect={setStrapStyle}
          />
        )}
        <OptionRow label="Padding" options={CB_PADDING_OPTIONS} selected={padding} onSelect={setPadding} />
        <OptionRow label="Underwire" options={CB_UNDERWIRE_OPTIONS} selected={underwire} onSelect={setUnderwire} />
        <OptionRow label="Closure" options={CB_CLOSURE_OPTIONS} selected={closure} onSelect={setClosure} />
        <OptionRow label="Support" options={CB_SUPPORT_OPTIONS} selected={support} onSelect={setSupport} />
      </div>
    </div>
  )
}
