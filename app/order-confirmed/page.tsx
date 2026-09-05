'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { pageWrap } from '@/lib/utils'
import { OrderStatusView } from '@/components/order/OrderStatusView'
import { readLastOrder, type PublicOrder } from '@/lib/orderPublic'

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') ?? ''
  const [order, setOrder] = useState<PublicOrder | null>(null)

  useEffect(() => {
    const last = readLastOrder()
    const id = orderId || last?.id
    const email = last?.email
    if (!id || !email) return
    if (orderId && last?.id && last.id !== orderId) return

    void (async () => {
      try {
        const res = await fetch('/api/orders/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: id, email }),
        })
        const json = (await res.json()) as { data?: PublicOrder }
        if (res.ok && json.data) setOrder(json.data)
      } catch {
        /* keep the thank-you without details */
      }
    })()
  }, [orderId])

  return (
    <div className={`${pageWrap} max-w-[40rem] py-16 md:py-24`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Order confirmed
      </p>
      <h1
        className="mb-4 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', letterSpacing: '-0.01em' }}
      >
        It&apos;s on its way.
      </h1>
      <p className="mb-8 font-sans text-[0.9rem] font-light text-mauve">
        Invisible, weightless, unforgettable.
      </p>
      {(order?.id || orderId) && (
        <p className="mb-10 font-sans text-[0.78rem] text-mauve">
          Order ID:{' '}
          <span className="font-medium text-deep">{order?.id ?? orderId}</span>
        </p>
      )}

      {order ? (
        <OrderStatusView order={order} />
      ) : (
        <p className="mb-10 font-sans text-[0.84rem] font-light leading-relaxed text-mauve">
          Keep the order ID. Look it up any time with the email used at checkout.
        </p>
      )}

      <div className="mt-12 flex flex-wrap gap-6">
        <Link
          href={orderId ? `/order?id=${encodeURIComponent(orderId)}` : '/order'}
          className="font-sans text-[0.78rem] tracking-btn uppercase text-deep underline underline-offset-4"
        >
          Look up this order
        </Link>
        <Link
          href="/shop"
          className="pressable pressable-track inline-flex h-11 items-center rounded-btn bg-deep px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedContent />
    </Suspense>
  )
}
