'use client'

interface PaymentMethodsProps {
  selected: string
  onSelect: (method: string) => void
  orderTotal: number
}

const METHODS = [
  { id: 'upi',        label: 'UPI',           icon: '⚡', sub: 'PhonePe · GPay · Paytm · Any UPI' },
  { id: 'card',       label: 'Credit / Debit Card', icon: '💳', sub: 'Visa · Mastercard · RuPay · Amex' },
  { id: 'netbanking', label: 'Net Banking',    icon: '🏦', sub: 'All major Indian banks' },
  { id: 'cod',        label: 'Cash on Delivery', icon: '📦', sub: 'Available on orders under ₹5,000' },
]

export function PaymentMethods({ selected, onSelect, orderTotal }: PaymentMethodsProps) {
  return (
    <div>
      <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
        Payment Method
      </p>
      <div className="space-y-2">
        {METHODS.map((method) => {
          const disabled = method.id === 'cod' && orderTotal >= 5000
          const active   = selected === method.id

          return (
            <button
              key={method.id}
              onClick={() => !disabled && onSelect(method.id)}
              disabled={disabled}
              className="w-full flex items-center gap-4 p-4 text-left transition-all duration-150 disabled:opacity-40"
              style={{
                borderRadius: 3,
                border:      `1.5px solid ${active ? '#0F0D0B' : '#D8D4CE'}`,
                background:   active ? 'rgba(15,13,11,0.03)' : 'transparent',
              }}
            >
              {/* Radio */}
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all"
                style={{
                  borderColor: active ? '#0F0D0B' : '#D8D4CE',
                  background:  active ? '#0F0D0B' : 'transparent',
                }}
              >
                {active && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-blush" />
                )}
              </span>

              {/* Icon + label */}
              <span className="text-lg">{method.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[0.82rem] text-deep">{method.label}</p>
                <p className="font-sans text-[0.65rem] text-mauve mt-0.5">{method.sub}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* UPI input */}
      {selected === 'upi' && (
        <div className="mt-3">
          <label className="font-sans text-[0.65rem] tracking-label uppercase text-mauve block mb-1.5">
            UPI ID
          </label>
          <input
            type="text"
            placeholder="yourname@upi"
            className="w-full h-11 px-3 font-sans text-[0.85rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
            style={{ borderRadius: 3 }}
          />
        </div>
      )}

      {/* Trust badge */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm">🔒</span>
        <p className="font-sans text-[0.65rem] text-mauve">
          Secured by Razorpay · 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}
