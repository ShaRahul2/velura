'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 999
const SHIPPING_COST           = 79

// Coupons live here — single source of truth
const COUPONS: Record<string, { type: 'pct' | 'flat'; value: number }> = {
  VELURA10: { type: 'pct',  value: 0.10 },
  FIRST50:  { type: 'flat', value: 50   },
}

interface Props {
  items:    CartItem[]
  onTotals: (totals: { subtotal: number; shipping: number; discount: number; total: number }) => void
}

export function OrderSummaryPanel({ items, onTotals }: Props) {
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  const coupon   = appliedCode ? COUPONS[appliedCode] : null
  const discount = coupon
    ? coupon.type === 'pct'
      ? Math.round(subtotal * coupon.value)
      : Math.min(coupon.value, subtotal)
    : 0
  const total = Math.max(0, subtotal + shipping - discount)

  // Keep parent in sync whenever totals change
  // (called via layout effect would cause extra renders — inline is fine for this size)

  function handleApply() {
    const code = couponInput.trim().toUpperCase()
    if (COUPONS[code]) {
      setAppliedCode(code)
      setCouponError('')
      onTotals({ subtotal, shipping, discount: COUPONS[code].type === 'pct'
        ? Math.round(subtotal * COUPONS[code].value)
        : Math.min(COUPONS[code].value, subtotal), total })
    } else {
      setCouponError('Invalid coupon code.')
    }
  }

  function handleRemove() {
    setAppliedCode(null)
    setCouponInput('')
    setCouponError('')
    onTotals({ subtotal, shipping, discount: 0, total: subtotal + shipping })
  }

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
            <div
              className="w-14 h-16 flex-shrink-0 flex items-center justify-center bg-blush overflow-hidden"
              style={{ borderRadius: 4 }}
            >
              {item.images[0] ? (
                <div className="relative w-full h-full">
                  <Image src={item.images[0]} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
              ) : (
                <span className="text-2xl">{item.emoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[0.88rem] text-deep leading-snug line-clamp-1">{item.name}</p>
              <p className="font-sans text-[0.65rem] text-mauve mt-0.5">Size {item.size} · Qty {item.qty}</p>
            </div>
            <span className="font-sans text-[0.8rem] text-deep flex-shrink-0">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      {appliedCode ? (
        <div className="flex items-center justify-between mb-4 px-3 py-2 bg-blush rounded-[3px]">
          <span className="font-sans text-[0.72rem] text-deep">
            <span className="font-medium">{appliedCode}</span> applied — saving {formatPrice(discount)}
          </span>
          <button
            onClick={handleRemove}
            className="font-sans text-[0.65rem] text-mauve underline underline-offset-2 ml-3"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Coupon code"
              className="flex-1 h-9 px-3 font-sans text-[0.78rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
              style={{ borderRadius: 3 }}
            />
            <button
              onClick={handleApply}
              className="h-9 px-4 font-sans text-[0.7rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
              style={{ borderRadius: 3 }}
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="font-sans text-[0.65rem] text-mauve mt-1">{couponError}</p>
          )}
        </div>
      )}

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
        {discount > 0 && (
          <div className="flex justify-between text-rose">
            <span className="font-sans text-[0.75rem]">Discount</span>
            <span className="font-sans text-[0.75rem]">−{formatPrice(discount)}</span>
          </div>
        )}
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
