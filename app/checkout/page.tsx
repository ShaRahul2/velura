'use client'

import { useState } from 'react'
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

const COUPONS: Record<string, number> = {
  VELURA10: 0.1,
  FIRST50:  50,
}

export default function CheckoutPage() {
  const router     = useRouter()
  const items      = useCartStore((s) => s.items)
  const clearCart  = useCartStore((s) => s.clear)
  const addToast   = useUiStore((s) => s.addToast)

  const [address, setAddress]     = useState<Address>(EMPTY_ADDRESS)
  const [payment, setPayment]     = useState('upi')
  const [coupon, setCoupon]       = useState('')
  const [discount, setDiscount]   = useState(0)
  const [loading, setLoading]     = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = subtotal >= 999 ? 0 : 79
  const total    = Math.max(0, subtotal + shipping - discount)

  function isAddressComplete() {
    const { firstName, lastName, email, phone, addressLine, city, state, pinCode } = address
    return !!(firstName && lastName && email && phone && addressLine && city && state && pinCode)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isAddressComplete() || items.length === 0) return
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items: items.map((i) => ({
            productId:  i.id,
            name:       i.name,
            qty:        i.qty,
            price:      i.price,
            size:       i.size,
            customSpec: i.customSpec,
          })),
          address,
          paymentMethod: payment,
        }),
      })

      const data = await res.json()
      clearCart()
      router.push(`/order-confirmed?id=${data.data?.orderId ?? 'ORD0000'}`)
    } catch {
      addToast('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-[1.4rem] font-light text-deep">Your bag is empty.</p>
        <Link
          href="/shop"
          className="font-sans text-[0.78rem] tracking-btn uppercase underline underline-offset-4 text-mauve"
        >
          Explore Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <div className="mb-8">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">Checkout</p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.01em' }}
        >
          Almost there.
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10">
          {/* Left — forms */}
          <div className="space-y-8">
            <AddressForm value={address} onChange={setAddress} />
            <PaymentMethods selected={payment} onSelect={setPayment} orderTotal={total} />

            <button
              type="submit"
              disabled={loading || !isAddressComplete()}
              className="w-full h-12 font-sans text-[0.8rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-40 hover:tracking-wide transition-all duration-200"
              style={{ borderRadius: 3 }}
            >
              {loading ? 'Placing Order…' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>

          {/* Right — order summary */}
          <OrderSummaryPanel items={items} />
        </div>
      </form>
    </div>
  )
}
