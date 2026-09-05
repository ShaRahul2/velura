'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'
import { OrderStatusView } from '@/components/order/OrderStatusView'
import type { PublicOrder } from '@/lib/orderPublic'

function LookupForm() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('id') ?? '')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<PublicOrder | null>(null)

  useEffect(() => {
    const fromQuery = searchParams.get('id')
    if (fromQuery && !orderId) setOrderId(fromQuery)
  }, [searchParams, orderId])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      })
      const json = (await res.json()) as { data?: PublicOrder; error?: string }
      if (!res.ok || !json.data) {
        setError(json.error ?? 'We could not find that order.')
        return
      }
      setOrder(json.data)
    } catch {
      setError('Could not look up the order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${pageWrap} max-w-[40rem] py-14 md:py-20`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Orders
      </p>
      <h1
        className="mb-4 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        Look up an order.
      </h1>
      <p className="mb-10 max-w-md font-sans text-[0.9rem] font-light leading-relaxed text-mauve">
        Use the order ID from checkout and the email you placed it with.
      </p>

      <form onSubmit={onSubmit} className="mb-12 space-y-4" noValidate>
        <div>
          <label htmlFor="lookup-order" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            Order ID
          </label>
          <input
            id="lookup-order"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            autoComplete="off"
            required
            className="h-12 w-full rounded-input border border-lm bg-cream px-3 font-sans text-[0.88rem] text-deep focus:border-deep focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="lookup-email" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            Email
          </label>
          <input
            id="lookup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-12 w-full rounded-input border border-lm bg-cream px-3 font-sans text-[0.88rem] text-deep focus:border-deep focus:outline-none"
          />
        </div>
        {error && (
          <p role="alert" className="font-sans text-[0.78rem] text-deep">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="pressable pressable-track h-12 px-8 rounded-btn bg-deep font-sans text-[0.8rem] tracking-btn uppercase text-blush disabled:opacity-40"
        >
          {loading ? 'Looking…' : 'View order'}
        </button>
      </form>

      {order && (
        <div>
          <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            {order.id}
          </p>
          <OrderStatusView order={order} />
        </div>
      )}

      <p className="mt-14 font-sans text-[0.78rem] font-light text-mauve">
        Lost the ID? Write to{' '}
        <Link href="/contact" className="text-deep underline underline-offset-4">
          the atelier
        </Link>
        .
      </p>
    </div>
  )
}

export default function OrderLookupPage() {
  return (
    <Suspense>
      <LookupForm />
    </Suspense>
  )
}
