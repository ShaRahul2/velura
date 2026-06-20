'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-[0.68rem] lg:text-[0.74rem] tracking-label uppercase text-rose mb-5">
        Something went wrong
      </p>
      <h1
        className="font-serif font-light text-deep mb-4"
        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '-0.01em' }}
      >
        An unexpected error occurred.
      </h1>
      <p className="font-sans text-[0.9rem] lg:text-[1rem] font-light text-mauve mb-10 max-w-md">
        We&apos;re sorry for the inconvenience. Please try again, or return to the collection.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-11 px-8 font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all"
          style={{ borderRadius: 3 }}
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center h-11 px-8 font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all"
          style={{ borderRadius: 3 }}
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}
