'use client'

import { useBuilderStore } from '@/store/builderStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

const BASE_PRICE = 999

interface ReviewRowProps {
  label: string
  value: string | null
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-lm last:border-0">
      <span className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">{label}</span>
      <span className="font-sans text-[0.8rem] text-deep capitalize">{value ?? <span className="text-mauve opacity-60">—</span>}</span>
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
    add({
      id:       Date.now(),
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
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Review your bra</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">Everything looks right? Add to your bag.</p>

      <div className="mb-6">
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
        className="p-4 mb-6"
        style={{ borderRadius: 4, background: 'rgba(15,13,11,0.03)', border: '1px solid #D8D4CE' }}
      >
        <div className="flex justify-between mb-2">
          <span className="font-sans text-[0.72rem] text-mauve">Base price</span>
          <span className="font-sans text-[0.72rem] text-deep">{formatPrice(BASE_PRICE)}</span>
        </div>
        {addOnTotal > 0 && (
          <div className="flex justify-between mb-2">
            <span className="font-sans text-[0.72rem] text-mauve">Add-ons</span>
            <span className="font-sans text-[0.72rem] text-deep">+{formatPrice(addOnTotal)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-lm">
          <span className="font-sans text-[0.72rem] tracking-label uppercase text-deep">Total</span>
          <span className="font-serif text-[1.2rem] font-light text-deep">{formatPrice(price)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="w-full h-12 font-sans text-[0.8rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all duration-200"
          style={{ borderRadius: 3 }}
        >
          Add to Bag · {formatPrice(price)}
        </button>
        <p className="font-sans text-[0.65rem] text-center text-mauve">
          Made-to-order · Ships in 7–10 days · Exchange on defects
        </p>
      </div>
    </div>
  )
}
