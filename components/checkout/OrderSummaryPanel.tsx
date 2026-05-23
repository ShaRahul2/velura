'use client'

import Image from 'next/image'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 999
const SHIPPING_COST           = 79

interface OrderSummaryPanelProps {
  items: CartItem[]
}

export function OrderSummaryPanel({ items }: OrderSummaryPanelProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total     = subtotal + shipping

  return (
    <div
      className="p-6 sticky top-24"
      style={{ borderRadius: 4, border: '1px solid #D8D4CE', background: '#FDFBF9' }}
    >
      <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
        Order Summary
      </p>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex gap-3 items-start">
            {/* Image / emoji */}
            <div
              className="w-14 h-16 flex-shrink-0 flex items-center justify-center bg-blush overflow-hidden"
              style={{ borderRadius: 4 }}
            >
              {item.images[0] ? (
                <div className="relative w-full h-full">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-2xl">{item.emoji}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-serif text-[0.88rem] text-deep leading-snug line-clamp-1">{item.name}</p>
              <p className="font-sans text-[0.65rem] text-mauve mt-0.5">
                Size {item.size} · Qty {item.qty}
              </p>
            </div>

            <span className="font-sans text-[0.8rem] text-deep flex-shrink-0">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Coupon code"
          className="flex-1 h-9 px-3 font-sans text-[0.78rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
          style={{ borderRadius: 3 }}
        />
        <button
          className="h-9 px-4 font-sans text-[0.7rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
          style={{ borderRadius: 3 }}
        >
          Apply
        </button>
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-4 border-t border-lm">
        <div className="flex justify-between">
          <span className="font-sans text-[0.75rem] text-mauve">Subtotal</span>
          <span className="font-sans text-[0.75rem] text-deep">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[0.75rem] text-mauve">Shipping</span>
          <span className="font-sans text-[0.75rem] text-deep">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="font-sans text-[0.63rem] text-rose">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <div className="flex justify-between pt-3 border-t border-lm">
          <span className="font-sans text-[0.75rem] tracking-label uppercase text-deep">Total</span>
          <span className="font-serif text-[1.3rem] font-light text-deep">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
