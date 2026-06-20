'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { calcShipping, calcDiscount, FREE_SHIPPING_THRESHOLD } from '@/lib/coupons'

interface Props {
  items:     CartItem[]
  onTotals:  (t: { subtotal: number; shipping: number; discount: number; total: number }) => void
  onCoupon?: (code: string | null) => void
}

export function OrderSummaryPanel({ items, onTotals, onCoupon }: Props) {
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [applying,    setApplying]    = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = calcShipping(subtotal)
  // Discount recomputed client-side from validated code + current subtotal
  const discount = calcDiscount(appliedCode, subtotal)
  const total    = Math.max(0, subtotal + shipping - discount)

  // Keep parent in sync on every render (covers mount + item changes + coupon changes)
  useEffect(() => {
    onTotals({ subtotal, shipping, discount, total })
    // onTotals is setTotals from parent useState — stable reference, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, shipping, discount, total])

  async function handleApply() {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setApplying(true)
    setCouponError('')
    try {
      const res  = await fetch('/api/coupons/validate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code, subtotal }),
      })
      const data = await res.json() as { data?: { code: string; discount: number }; error?: string }
      if (!res.ok || data.error) {
        setCouponError(data.error ?? 'Invalid coupon code.')
        return
      }
      setAppliedCode(data.data!.code)
      onCoupon?.(data.data!.code)
    } catch {
      setCouponError('Failed to validate coupon. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  function handleRemove() {
    setAppliedCode(null)
    setCouponInput('')
    setCouponError('')
    onCoupon?.(null)
  }

  return (
    <div
      className="p-6 sticky top-24"
      style={{ borderRadius: 4, border: '1px solid #D8D4CE', background: '#FDFBF9' }}
    >
      <p className="font-sans text-[0.68rem] lg:text-[0.72rem] tracking-label uppercase text-rose mb-4">
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
              <p className="font-serif text-[0.88rem] lg:text-[0.95rem] text-deep leading-snug line-clamp-1">{item.name}</p>
              <p className="font-sans text-[0.65rem] lg:text-[0.7rem] text-mauve mt-0.5">Size {item.size} · Qty {item.qty}</p>
            </div>
            <span className="font-sans text-[0.8rem] lg:text-[0.88rem] text-deep flex-shrink-0">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      {appliedCode ? (
        <div className="flex items-center justify-between mb-4 px-3 py-2 bg-blush rounded-[3px]">
          <span className="font-sans text-[0.72rem] lg:text-[0.78rem] text-deep">
            <span className="font-medium">{appliedCode}</span> applied — saving {formatPrice(discount)}
          </span>
          <button
            onClick={handleRemove}
            className="font-sans text-[0.65rem] lg:text-[0.7rem] text-mauve underline underline-offset-2 ml-3"
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
              className="flex-1 h-9 px-3 font-sans text-[0.78rem] lg:text-[0.85rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
              style={{ borderRadius: 3 }}
            />
            <button
              onClick={handleApply}
              disabled={applying}
              className="h-9 px-4 font-sans text-[0.7rem] lg:text-[0.76rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200 disabled:opacity-50"
              style={{ borderRadius: 3 }}
            >
              {applying ? '…' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className="font-sans text-[0.65rem] lg:text-[0.7rem] text-mauve mt-1">{couponError}</p>
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
