'use client'

import { formatPrice } from '@/lib/utils'
import { ProgressBar } from '@/components/ui/ProgressBar'

const FREE_SHIPPING_THRESHOLD = 999
const FLAT_SHIPPING = 79

interface CartSummaryProps {
  subtotal: number
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const shipping   = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
  const total      = subtotal + shipping
  const remaining  = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <div className="flex flex-col gap-4">
      {/* Shipping progress */}
      {remaining > 0 ? (
        <div className="rounded-card bg-blush p-3">
          <p className="font-sans text-[0.72rem] text-mauve mb-2">
            Add {formatPrice(remaining)} more for free shipping
          </p>
          <ProgressBar value={subtotal} max={FREE_SHIPPING_THRESHOLD} />
        </div>
      ) : (
        <div className="rounded-card bg-blush p-3">
          <p className="font-sans text-[0.72rem] text-mauve">
            ✓ Free shipping unlocked
          </p>
          <ProgressBar value={FREE_SHIPPING_THRESHOLD} max={FREE_SHIPPING_THRESHOLD} className="mt-2" />
        </div>
      )}

      {/* Totals */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-sans text-[0.82rem]">
          <span className="text-mauve">Subtotal</span>
          <span className="text-deep">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-sans text-[0.82rem]">
          <span className="text-mauve">Shipping</span>
          <span className="text-deep">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        <div className="h-px bg-lm my-1" />
        <div className="flex justify-between">
          <span className="font-sans text-[0.9rem] font-medium text-deep">Total</span>
          <span className="font-serif text-[1.1rem] text-deep">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
