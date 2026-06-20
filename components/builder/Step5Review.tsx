'use client'

import { useBuilderStore } from '@/store/builderStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'

const BASE_PRICE = 999

interface ReviewRowProps {
  label: string
  value: string | null
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between gap-1.5 py-0.5 border-b border-lm">
      <span className="font-sans text-[0.5rem] lg:text-[0.54rem] tracking-label uppercase text-mauve">{label}</span>
      <span className="font-sans text-[0.64rem] lg:text-[0.7rem] text-deep capitalize truncate">{value ?? <span className="text-mauve opacity-60">—</span>}</span>
    </div>
  )
}

export function Step5Review() {
  const store   = useBuilderStore()
  const add     = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

  const { band, cup, braType, strapStyle, padding, underwire, closure, support, fabric, color, price, reset } = store

  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const size = band && cup ? `${band}${cup}` : '—'

  function handleAddToCart() {
    // Deterministic spec-based ID: same config → same cart line (qty++).
    // Shifted into 1_000_000+ range so it can never collide with product IDs (1–15).
    const spec   = buildVisualSpec({ sizeMode: store.sizeMode, band, cup, braType, strapStyle, padding, underwire, closure, support, fabric, color, fitUnit: store.fitUnit })
    const hash   = specToHash(spec)
    const itemId = 1_000_000 + parseInt(hash.slice(0, 7), 16)
    add({
      id:       itemId,
      name:     `Custom ${braType ? braType.charAt(0).toUpperCase() + braType.slice(1) : ''} Bra`,
      price,
      qty:      1,
      size,
      emoji:    '✦',
      images:   [],
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
      <h3 className="font-serif text-[1.1rem] lg:text-[1.2rem] font-light text-deep mb-px">Review your bra</h3>
      <p className="font-sans text-[0.6rem] lg:text-[0.66rem] text-mauve mb-1.5">Looks right? Add to bag.</p>

      <div className="grid grid-cols-2 gap-x-4 mb-2">
        <ReviewRow label="Size"         value={size} />
        <ReviewRow label="Type"         value={braType} />
        <ReviewRow label="Straps"       value={strapStyle} />
        <ReviewRow label="Padding"      value={padding} />
        <ReviewRow label="Underwire"    value={underwire} />
        <ReviewRow label="Closure"      value={closure} />
        <ReviewRow label="Support"      value={support} />
        <ReviewRow label="Fabric"       value={fabric} />
        <ReviewRow label="Colour"       value={selectedColor?.label ?? color} />
      </div>

      {/* Pricing breakdown */}
      <div
        className="p-2 mb-2"
        style={{ borderRadius: 3, background: 'rgba(15,13,11,0.03)', border: '1px solid #D8D4CE' }}
      >
        <div className="flex justify-between text-[0.62rem] lg:text-[0.68rem]">
          <span className="text-mauve">Base</span>
          <span className="text-deep">{formatPrice(BASE_PRICE)}</span>
        </div>
        {addOnTotal > 0 && (
          <div className="flex justify-between text-[0.62rem] lg:text-[0.68rem]">
            <span className="text-mauve">Add-ons</span>
            <span className="text-deep">+{formatPrice(addOnTotal)}</span>
          </div>
        )}
        <div className="flex justify-between pt-1 mt-1 border-t border-lm">
          <span className="font-sans text-[0.62rem] lg:text-[0.68rem] tracking-label uppercase text-deep">Total</span>
          <span className="font-serif text-lg font-light text-deep">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <button
          onClick={handleAddToCart}
          className="w-full h-8 font-sans text-[0.68rem] lg:text-[0.74rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all duration-200"
          style={{ borderRadius: 3 }}
        >
          Add to Bag · {formatPrice(price)}
        </button>
        <p className="font-sans text-[0.55rem] lg:text-[0.6rem] text-center text-mauve">
          Made-to-order · 7–10 days · Exchange on defects
        </p>
      </div>
    </div>
  )
}
