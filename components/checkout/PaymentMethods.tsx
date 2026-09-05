'use client'

import { Smartphone, CreditCard, Building2, Package, ShieldCheck } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { COD_LIMIT } from '@/lib/coupons'

interface PaymentMethodsProps {
  selected: string
  onSelect: (method: string) => void
  orderTotal: number
  onlineEnabled?: boolean
}

const METHODS = [
  { id: 'upi',        label: 'UPI',                Icon: Smartphone,  sub: 'PhonePe · GPay · Paytm' },
  { id: 'card',       label: 'Credit / Debit Card', Icon: CreditCard,  sub: 'Visa · Mastercard · RuPay' },
  { id: 'netbanking', label: 'Net Banking',         Icon: Building2,   sub: 'All major Indian banks' },
  { id: 'cod',        label: 'Cash on Delivery',    Icon: Package,     sub: `Orders under ${formatPrice(COD_LIMIT)}` },
]

export function PaymentMethods({ selected, onSelect, orderTotal, onlineEnabled = true }: PaymentMethodsProps) {
  return (
    <div>
      <p className="mb-5 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Payment
      </p>
      {!onlineEnabled && (
        <p className="mb-4 font-sans text-[0.78rem] leading-relaxed text-mauve">
          Razorpay keys are not in this environment, so UPI, cards and net banking cannot charge yet. Cash on Delivery is available. Add <span className="text-deep">RAZORPAY_KEY_ID</span> to enable online payment.
        </p>
      )}
      <div className="space-y-2" role="radiogroup" aria-label="Payment method">
        {METHODS.map((method) => {
          const online = method.id !== 'cod'
          const disabled =
            (online && !onlineEnabled) ||
            (method.id === 'cod' && orderTotal >= COD_LIMIT)
          const active   = selected === method.id
          const { Icon } = method

          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => !disabled && onSelect(method.id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-btn border p-4 text-left transition-[background-color,border-color] duration-150 ease-out disabled:opacity-40',
                active ? 'border-deep bg-blush/70' : 'border-lm bg-transparent'
              )}
            >
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color] duration-150 ease-out',
                  active ? 'border-deep bg-deep' : 'border-lm bg-transparent'
                )}
                aria-hidden="true"
              >
                {active && <span className="block h-1.5 w-1.5 rounded-full bg-blush" />}
              </span>
              <Icon size={18} strokeWidth={1.6} className="shrink-0 text-mauve" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[0.88rem] text-deep">{method.label}</p>
                <p className="mt-0.5 font-sans text-[0.7rem] text-mauve">{method.sub}</p>
              </div>
            </button>
          )
        })}
      </div>

      {selected === 'upi' && (
        <div className="mt-4">
          <label htmlFor="checkout-upi" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            UPI ID <span className="font-normal normal-case tracking-normal text-mauve/70">(optional)</span>
          </label>
          <input
            id="checkout-upi"
            type="text"
            name="upiId"
            autoComplete="off"
            placeholder="name@upi"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
            className="h-12 w-full rounded-input border border-lm bg-cream px-3 font-sans text-[0.88rem] text-deep placeholder:text-mauve/40 transition-colors focus:border-deep focus:outline-none"
          />
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <ShieldCheck size={14} strokeWidth={1.6} className="text-mauve" aria-hidden="true" />
        <p className="font-sans text-[0.68rem] text-mauve">
          UPI, cards and net banking via Razorpay · 256-bit SSL
        </p>
      </div>
    </div>
  )
}
