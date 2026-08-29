'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { AddressForm } from '@/components/checkout/AddressForm'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import { OrderSummaryPanel } from '@/components/checkout/OrderSummaryPanel'
import type { Address } from '@/types'
import Link from 'next/link'

const EMPTY_ADDRESS: Address = {
  firstName:   '',
  lastName:    '',
  email:       '',
  phone:       '',
  addressLine: '',
  city:        '',
  state:       '',
  pinCode:     '',
}

export default function CheckoutPage() {
  const router    = useRouter()
  const items     = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const addToast  = useUiStore((s) => s.addToast)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const [address,    setAddress]    = useState<Address>(EMPTY_ADDRESS)
  const [payment,    setPayment]    = useState('upi')
  const [loading,    setLoading]    = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  // Totals are owned by OrderSummaryPanel (single source of truth).
  // The panel calls onTotals on every render so this is always current.
  const [totals, setTotals] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total:    0,
  })

  function missingAddressFields() {
    const fields: { id: string; label: string; ok: boolean }[] = [
      { id: 'checkout-firstName', label: 'first name', ok: Boolean(address.firstName.trim()) },
      { id: 'checkout-lastName', label: 'last name', ok: Boolean(address.lastName.trim()) },
      { id: 'checkout-email', label: 'email', ok: Boolean(address.email.trim()) },
      { id: 'checkout-phone', label: 'phone', ok: Boolean(address.phone.trim()) },
      { id: 'checkout-addressLine', label: 'address', ok: Boolean(address.addressLine.trim()) },
      { id: 'checkout-city', label: 'city', ok: Boolean(address.city.trim()) },
      { id: 'checkout-state', label: 'state', ok: Boolean(address.state.trim()) },
      { id: 'checkout-pinCode', label: 'PIN code', ok: Boolean(address.pinCode.trim()) },
    ]
    return fields.filter((f) => !f.ok)
  }

  function isAddressComplete() {
    return missingAddressFields().length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!isAddressComplete() || items.length === 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items: items.map((i) => ({
            productId:  i.isCustom ? null : i.id,
            name:       i.name,
            qty:        i.qty,
            price:      i.price,
            size:       i.size,
            customSpec: i.customSpec,
          })),
          address,
          paymentMethod: payment,
          couponCode,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast((err as { error?: string }).error ?? 'Something went wrong. Please try again.')
        return
      }

      const data = await res.json() as { data: { orderId: string } }
      clearCart()
      router.push(`/order-confirmed?order=${data.data.orderId}`)
    } catch {
      addToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        {mounted && (
          <>
            <p className="font-serif text-[1.4rem] font-light text-deep">Your bag is empty.</p>
            <Link
              href="/shop"
              className="font-sans text-[0.78rem] lg:text-[0.84rem] tracking-btn uppercase underline underline-offset-4 text-mauve"
            >
              Explore Collection
            </Link>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8 lg:px-12 py-10 md:py-14">
      <div className="mb-8">
        <p className="font-sans text-[0.68rem] lg:text-[0.74rem] tracking-label uppercase text-rose mb-2">Checkout</p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.01em' }}
        >
          Almost there.
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">
          {/* Left — forms */}
          <div className="space-y-8">
            {submitted && missingAddressFields().length > 0 && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                aria-labelledby="checkout-error-title"
                className="border border-lm bg-blush/60 p-4 outline-none"
              >
                <p id="checkout-error-title" className="font-sans text-[0.78rem] tracking-btn uppercase text-deep mb-2">
                  There is a problem
                </p>
                <ul className="flex flex-col gap-1">
                  {missingAddressFields().map((field) => (
                    <li key={field.id}>
                      <a href={`#${field.id}`} className="font-sans text-[0.84rem] text-deep underline underline-offset-4">
                        Enter {field.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <AddressForm value={address} onChange={setAddress} submitted={submitted} />
            <PaymentMethods selected={payment} onSelect={setPayment} orderTotal={totals.total} />

            <button
              type="submit"
              disabled={loading}
              className="pressable pressable-track w-full h-12 font-sans text-[0.8rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-40"
              style={{ borderRadius: 3 }}
            >
              {loading
                ? 'Placing Order…'
                : `Place Order · ₹${totals.total.toLocaleString('en-IN')}`}
            </button>
          </div>

          {/* Right — order summary (owns total calculation) */}
          <OrderSummaryPanel
            items={items}
            onTotals={setTotals}
            onCoupon={setCouponCode}
          />
        </div>
      </form>
    </div>
  )
}
