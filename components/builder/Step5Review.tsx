'use client'

import { useBuilderStore, BASE_PRICE } from '@/store/builderStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import {
  CB_BRA_TYPES,
  CB_STRAP_STYLES,
  CB_PADDING_OPTIONS,
  CB_UNDERWIRE_OPTIONS,
  CB_CLOSURE_OPTIONS,
  CB_SUPPORT_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_COLOR_OPTIONS,
  optionLabel,
} from '@/data/builderOptions'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'

interface ReviewRowProps {
  label: string
  value: string
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-lm">
      <span className="font-sans text-[0.62rem] tracking-label uppercase text-mauve">{label}</span>
      <span className="font-sans text-[0.84rem] text-deep truncate">{value}</span>
    </div>
  )
}

export function Step5Review() {
  const store    = useBuilderStore()
  const add      = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

  const { band, cup, braType, strapStyle, padding, underwire, closure, support, fabric, color, price, reset } = store

  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const size = band && cup ? `${band}${cup}` : '—'
  const typeLabel = optionLabel(CB_BRA_TYPES, braType)

  function handleAddToCart() {
    const spec = buildVisualSpec({
      sizeMode: store.sizeMode, band, cup, braType, strapStyle, padding,
      underwire, closure, support, fabric, color, fitUnit: store.fitUnit,
    })
    const hash = specToHash(spec)
    const itemId = 1_000_000 + parseInt(hash.slice(0, 7), 16)
    add({
      id:    itemId,
      name:  `Custom ${typeLabel} Bra`,
      price,
      qty:   1,
      size,
      emoji: '✦',
      images: [],
      isCustom: true,
      customSpec: {
        sizeMode: store.sizeMode,
        band, cup, braType, strapStyle, padding, underwire, closure, support, fabric, color,
        fitUnit: store.fitUnit,
      },
    })
    addToast('Custom bra added to bag')
    openCart()
    reset()
  }

  const addOnTotal = price - BASE_PRICE

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Review your bra</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">Looks right? Add it to the bag.</p>

      <div className="mb-5">
        <ReviewRow label="Size"      value={size} />
        <ReviewRow label="Type"      value={typeLabel} />
        <ReviewRow label="Straps"    value={braType === 'strapless' ? 'No straps' : optionLabel(CB_STRAP_STYLES, strapStyle)} />
        <ReviewRow label="Padding"   value={optionLabel(CB_PADDING_OPTIONS, padding)} />
        <ReviewRow label="Underwire" value={optionLabel(CB_UNDERWIRE_OPTIONS, underwire)} />
        <ReviewRow label="Closure"   value={optionLabel(CB_CLOSURE_OPTIONS, closure)} />
        <ReviewRow label="Support"   value={optionLabel(CB_SUPPORT_OPTIONS, support)} />
        <ReviewRow label="Fabric"    value={optionLabel(CB_FABRIC_OPTIONS, fabric)} />
        <ReviewRow label="Colour"    value={selectedColor?.label ?? '—'} />
      </div>

      <div
        className="p-4 mb-5"
        style={{ borderRadius: 4, background: 'rgba(15,13,11,0.03)', border: '1px solid #D8D4CE' }}
      >
        <div className="flex justify-between text-[0.8rem]">
          <span className="text-mauve">Base</span>
          <span className="text-deep">{formatPrice(BASE_PRICE)}</span>
        </div>
        {addOnTotal > 0 && (
          <div className="flex justify-between text-[0.8rem] mt-1">
            <span className="text-mauve">Add-ons</span>
            <span className="text-deep">+{formatPrice(addOnTotal)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 mt-2 border-t border-lm">
          <span className="font-sans text-[0.68rem] tracking-label uppercase text-deep">Total</span>
          <span className="font-serif text-[1.4rem] font-light text-deep">{formatPrice(price)}</span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full h-12 font-sans text-[0.8rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all duration-200 rounded-btn"
      >
        Add to Bag · {formatPrice(price)}
      </button>
      <p className="font-sans text-[0.68rem] text-center text-mauve mt-3">
        Made-to-order · 7–10 days · Exchange on defects
      </p>
    </div>
  )
}
