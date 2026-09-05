'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { pageWrap } from '@/lib/utils'

export function WishlistGrid({ catalog }: { catalog: Product[] }) {
  const ids = useWishlistStore((s) => s.ids)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const saved = mounted
    ? ids
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined)
    : []

  return (
    <div className={`${pageWrap} py-12 md:py-16 lg:py-20`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Saved
      </p>
      <h1
        className="mb-10 font-serif font-light text-deep md:mb-14"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}
      >
        The ones you kept.
      </h1>

      {!mounted ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-blush" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="max-w-md">
          <p className="mb-6 font-sans text-[0.95rem] font-light text-mauve">
            Nothing saved. The collection is still there.
          </p>
          <Link
            href="/shop"
            className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-deep px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
