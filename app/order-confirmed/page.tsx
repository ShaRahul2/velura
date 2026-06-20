'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order') ?? ''

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 max-w-xl mx-auto text-center">
      <div style={{ animation: 'popIn 0.4s ease' }}>
        <p className="font-sans text-[0.68rem] lg:text-[0.72rem] tracking-label uppercase text-rose mb-5">
          Order confirmed
        </p>
        <h1
          className="font-serif font-light text-deep mb-4"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', letterSpacing: '-0.01em' }}
        >
          It&apos;s on its way.
        </h1>
        <p className="font-sans text-[0.9rem] lg:text-[1rem] font-light text-mauve mb-2">
          Invisible, weightless, unforgettable.
        </p>
        {orderId && (
          <p className="font-sans text-[0.78rem] lg:text-[0.84rem] text-mauve mb-8">
            Order ID: <span className="text-deep font-medium">{orderId}</span>
          </p>
        )}
        <p className="font-sans text-[0.82rem] lg:text-[0.9rem] text-mauve mb-10">
          You&apos;ll receive a confirmation shortly.
          <br />
          Estimated delivery: 3–5 business days.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center h-11 px-8 rounded-btn font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all"
        >
          Continue Shopping
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
