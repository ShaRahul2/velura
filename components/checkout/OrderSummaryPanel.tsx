'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { calcShipping, calcDiscount, FREE_SHIPPING_THRESHOLD } from '@/lib/coupons'
import { describeCartLine } from '@/lib/productDescribe'
import { useUiStore } from '@/store/uiStore'

interface Props {
  items:     CartItem[]
  onTotals:  (t: { subtotal: number; shipping: number; discount: number; total: number }) => void
  onCoupon?: (code: string | null) => void
}

export function OrderSummaryPanel({ items, onTotals, onCoupon }: Props) {
  const openCart = useUiStore((s) => s.openCart)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const [applying,    setApplying]    = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = calcShipping(subtotal)
  const discount = calcDiscount(appliedCode, subtotal)
  const total    = Math.max(0, subtotal + shipping - discount)

  useEffect(() => {
    onTotals({ subtotal, shipping, discount, total })
    // onTotals is setTotals from parent useState — stable reference
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
      setCouponError('Could not apply that code.')
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
    <div className="rounded-card border border-lm bg-blush/50 p-6 lg:sticky lg:top-24">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose">
          Order
        </p>
        <button
          type="button"
          onClick={openCart}
          className="font-sans text-[0.68rem] tracking-btn uppercase text-mauve underline underline-offset-4 hover:text-deep"
        >
          Edit bag
        </button>
      </div>

      <div className="mb-5 space-y-3">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color ?? ''}`} className="flex items-start gap-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-card bg-blush lg:h-20 lg:w-16">
              {item.images[0] ? (
                <Image src={item.images[0]} alt={describeCartLine(item)} fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center font-serif text-lg text-mauve">
                  {item.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-serif text-[0.95rem] leading-snug text-deep">{item.name}</p>
              <p className="mt-0.5 font-sans text-[0.7rem] text-mauve">
                Size {item.size} · Qty {item.qty}
              </p>
            </div>
            <span className="shrink-0 font-sans text-[0.88rem] tabular-nums text-deep">
              {formatPrice(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {appliedCode ? (
        <div className="mb-5 flex items-center justify-between rounded-btn bg-cream px-3 py-2.5">
          <span className="font-sans text-[0.78rem] text-deep">
            <span className="font-medium">{appliedCode}</span> — saving {formatPrice(discount)}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-3 font-sans text-[0.7rem] text-mauve underline underline-offset-2 hover:text-deep"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleApply()
                }
              }}
              placeholder="Coupon code"
              aria-label="Coupon code"
              aria-invalid={Boolean(couponError)}
              aria-describedby={couponError ? 'coupon-error' : undefined}
              className="h-11 flex-1 rounded-input border border-lm bg-cream px-3 font-sans text-[0.85rem] text-deep placeholder:text-mauve/40 transition-colors focus:border-deep focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void handleApply()}
              disabled={applying}
              className="pressable pressable-track h-11 px-4 rounded-btn border border-deep font-sans text-[0.72rem] tracking-btn uppercase text-deep hover:bg-deep hover:text-blush disabled:opacity-50"
            >
              {applying ? 'Applying' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p id="coupon-error" role="alert" className="mt-1.5 font-sans text-[0.7rem] text-mauve">
              {couponError}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-lm pt-4">
        <div className="flex justify-between">
          <span className="font-sans text-[0.82rem] text-mauve">Subtotal</span>
          <span className="font-sans text-[0.82rem] tabular-nums text-deep">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[0.82rem] text-mauve">Shipping</span>
          <span className="font-sans text-[0.82rem] tabular-nums text-deep">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="font-sans text-[0.82rem] text-mauve">Discount</span>
            <span className="font-sans text-[0.82rem] tabular-nums text-deep">−{formatPrice(discount)}</span>
          </div>
        )}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="font-sans text-[0.68rem] text-mauve">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <div className="flex items-baseline justify-between border-t border-lm pt-3">
          <span className="font-sans text-[0.72rem] tracking-label uppercase text-deep">Total</span>
          <span className="font-serif text-[1.4rem] font-light tabular-nums text-deep">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
