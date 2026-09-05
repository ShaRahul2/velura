'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { AddressForm } from '@/components/checkout/AddressForm'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import { OrderSummaryPanel } from '@/components/checkout/OrderSummaryPanel'
import type { Address } from '@/types'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'
import { COD_LIMIT } from '@/lib/coupons'
import { isOnlineMethod, razorpayAvailableInBrowser } from '@/lib/payments'
import { googleMapsBrowserKey, googlePlacesAvailable } from '@/lib/indianAddress'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string
      amount: number
      currency: string
      name: string
      description: string
      order_id: string
      prefill: { name: string; email: string; contact: string }
      theme: { color: string }
      handler: (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) => void
      modal?: { ondismiss?: () => void }
    }) => { open: () => void }
  }
}

function waitForRazorpay(ms = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const start = Date.now()
    const id = window.setInterval(() => {
      if (window.Razorpay) {
        window.clearInterval(id)
        resolve(true)
      } else if (Date.now() - start > ms) {
        window.clearInterval(id)
        resolve(false)
      }
    }, 80)
  })
}

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
  const hydrated  = useCartHydrated()

  const [address,    setAddress]    = useState<Address>(EMPTY_ADDRESS)
  const onlinePay = razorpayAvailableInBrowser()
  const [payment,    setPayment]    = useState(onlinePay ? 'upi' : 'cod')
  const [loading,    setLoading]    = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [totals, setTotals] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total:    0,
  })

  useEffect(() => {
    if (!onlinePay && isOnlineMethod(payment)) {
      setPayment('cod')
      return
    }
    if (payment === 'cod' && totals.total >= COD_LIMIT && onlinePay) {
      setPayment('upi')
    }
  }, [payment, totals.total, onlinePay])

  function missingAddressFields() {
    const fields: { id: string; label: string; ok: boolean }[] = [
      { id: 'checkout-firstName', label: 'First name', ok: Boolean(address.firstName.trim()) },
      { id: 'checkout-lastName', label: 'Last name', ok: Boolean(address.lastName.trim()) },
      { id: 'checkout-email', label: 'Email', ok: Boolean(address.email.trim()) },
      { id: 'checkout-phone', label: 'Phone', ok: Boolean(address.phone.trim()) },
      { id: 'checkout-addressLine', label: 'Address', ok: Boolean(address.addressLine.trim()) },
      { id: 'checkout-city', label: 'City', ok: Boolean(address.city.trim()) },
      { id: 'checkout-state', label: 'State', ok: Boolean(address.state.trim()) },
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
      const first = missingAddressFields()[0]
      requestAnimationFrame(() => {
        document.getElementById(first?.id)?.focus()
      })
      return
    }
    if (isOnlineMethod(payment) && !onlinePay) {
      addToast('Online payment needs Razorpay keys. Use Cash on Delivery for now.')
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
      const orderId = data.data.orderId

      if (!isOnlineMethod(payment)) {
        clearCart()
        router.push(`/order-confirmed?order=${orderId}`)
        return
      }

      const payRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      if (!payRes.ok) {
        const err = await payRes.json().catch(() => ({}))
        addToast((err as { error?: string }).error ?? 'Could not start Razorpay.')
        return
      }
      const pay = await payRes.json() as {
        data: { razorpayOrderId: string; amount: number; key: string }
      }

      const ready = await waitForRazorpay()
      if (!ready || !window.Razorpay) {
        addToast('Razorpay is still loading. Try Place Order again.')
        return
      }

      const rzp = new window.Razorpay({
        key: pay.data.key,
        amount: pay.data.amount,
        currency: 'INR',
        name: 'VELURA',
        description: `Order ${orderId}`,
        order_id: pay.data.razorpayOrderId,
        prefill: {
          name: `${address.firstName} ${address.lastName}`.trim(),
          email: address.email,
          contact: address.phone,
        },
        theme: { color: '#0F0D0B' },
        handler: (response) => {
          void (async () => {
            const verify = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId, ...response }),
            })
            if (!verify.ok) {
              addToast('Payment received but could not be verified. Contact us with your order id.')
              return
            }
            clearCart()
            router.push(`/order-confirmed?order=${orderId}`)
          })()
        },
        modal: {
          ondismiss: () => {
            addToast('Payment cancelled. Your bag is still here.')
          },
        },
      })
      rzp.open()
      return
    } catch {
      addToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) {
    return (
      <div className={`${pageWrap} py-12 md:py-16`} aria-hidden="true">
        <div className="mb-3 h-3 w-20 bg-blush" />
        <div className="mb-10 h-9 w-48 bg-blush" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-blush" />
            ))}
          </div>
          <div className="h-72 bg-blush" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100svh-8.5rem)] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
          Checkout
        </p>
        <p className="mb-3 font-serif text-[2rem] font-light text-deep md:text-[2.4rem]">
          Your bag is empty.
        </p>
        <p className="mb-8 max-w-xs font-sans text-[0.9rem] font-light leading-relaxed text-mauve">
          Nothing to place yet.
        </p>
        <Link
          href="/shop"
          className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-deep px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush"
        >
          Explore Collection
        </Link>
      </div>
    )
  }

  const submitLabel = loading
    ? 'Placing Order…'
    : `Place Order · ₹${totals.total.toLocaleString('en-IN')}`

  return (
    <div className={`${pageWrap} py-10 pb-28 md:py-14 lg:pb-16`}>
      {onlinePay && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      )}
      {googlePlacesAvailable() && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsBrowserKey()}&libraries=places&language=en&region=IN`}
          strategy="afterInteractive"
        />
      )}
      <div className="mb-10">
        <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
          Checkout
        </p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)', letterSpacing: '-0.01em' }}
        >
          Almost there.
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="order-2 space-y-10 lg:order-1">
            {submitted && missingAddressFields().length > 0 && (
              <div role="alert" aria-labelledby="checkout-error-title">
                <p
                  id="checkout-error-title"
                  className="font-serif text-[1.2rem] font-light leading-snug text-deep"
                >
                  A few details are still needed.
                </p>
                <p className="mt-2 font-sans text-[0.78rem] leading-relaxed text-mauve">
                  {missingAddressFields().map((field, i, all) => (
                    <span key={field.id}>
                      <a
                        href={`#${field.id}`}
                        className="underline decoration-lm underline-offset-4 transition-colors hover:text-deep hover:decoration-deep"
                      >
                        {field.label}
                      </a>
                      {i < all.length - 1 ? <span aria-hidden="true"> · </span> : null}
                    </span>
                  ))}
                </p>
              </div>
            )}
            <AddressForm value={address} onChange={setAddress} submitted={submitted} />
            <PaymentMethods
              selected={payment}
              onSelect={setPayment}
              orderTotal={totals.total}
              onlineEnabled={onlinePay}
            />

            <button
              type="submit"
              disabled={loading}
              className="pressable pressable-track hidden h-12 w-full rounded-btn bg-deep font-sans text-[0.8rem] tracking-btn uppercase text-blush disabled:opacity-40 lg:inline-flex lg:items-center lg:justify-center"
            >
              {submitLabel}
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <OrderSummaryPanel
              items={items}
              onTotals={setTotals}
              onCoupon={setCouponCode}
            />
          </div>
        </div>

        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-lm bg-cream/96 px-5 py-3 backdrop-blur-md lg:hidden"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="submit"
            disabled={loading}
            className="pressable pressable-track flex h-12 w-full items-center justify-center rounded-btn bg-deep font-sans text-[0.8rem] tracking-btn uppercase text-blush disabled:opacity-40"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
