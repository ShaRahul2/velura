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

interface OptionRowProps<T extends { id: string; label: string; price: number }> {
  label: string
  options: T[]
  selected: string | null
  onSelect: (id: string) => void
}

function OptionRow<T extends { id: string; label: string; price: number }>({
  label,
  options,
  selected,
  onSelect,
}: OptionRowProps<T>) {
  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="h-8 px-3 font-sans text-[0.72rem] transition-all duration-150 flex items-center gap-1.5"
              style={{
                borderRadius: 3,
                background: active ? '#0F0D0B' : 'transparent',
                color:       active ? '#EDE9E4' : '#0F0D0B',
                border:      active ? 'none'   : '1px solid #D8D4CE',
              }}
            >
              {opt.label}
              {opt.price > 0 && (
                <span style={{ color: active ? 'rgba(237,233,228,0.6)' : '#9A8878', fontSize: '0.6rem' }}>
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
    strapStyle, setStrapStyle,
    padding,    setPadding,
    underwire,  setUnderwire,
    closure,    setClosure,
    support,    setSupport,
  } = useBuilderStore()

  return (
    <div>
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Style & support</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">Tailor the fit to exactly how you like it.</p>

      <div className="space-y-5">
        <OptionRow label="Straps" options={CB_STRAP_STYLES} selected={strapStyle} onSelect={setStrapStyle} />
        <OptionRow label="Padding" options={CB_PADDING_OPTIONS} selected={padding} onSelect={setPadding} />
        <OptionRow label="Underwire" options={CB_UNDERWIRE_OPTIONS} selected={underwire} onSelect={setUnderwire} />
        <OptionRow label="Closure" options={CB_CLOSURE_OPTIONS} selected={closure} onSelect={setClosure} />
        <OptionRow label="Support level" options={CB_SUPPORT_OPTIONS} selected={support} onSelect={setSupport} />
      </div>
    </div>
  )
}
