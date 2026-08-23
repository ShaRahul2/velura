'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { products as catalog } from '@/data/products'
import { ProductCard } from '@/components/shop/ProductCard'

const KEY = 'velura-recent'
const MAX = 8

export function rememberProduct(id: number) {
  try {
    const raw = window.localStorage.getItem(KEY)
    const prev: number[] = raw ? (JSON.parse(raw) as number[]) : []
    const next = [id, ...prev.filter((n) => n !== id)].slice(0, MAX)
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore quota / private mode */
  }
}

export function RecentlyViewedTracker({ id }: { id: number }) {
  useEffect(() => {
    rememberProduct(id)
  }, [id])
  return null
}

export function RecentlyViewed({ currentId }: { currentId: number }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const ids: number[] = raw ? (JSON.parse(raw) as number[]) : []
      const seen = ids
        .filter((id) => id !== currentId)
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4)
      setItems(seen)
    } catch {
      setItems([])
    }
  }, [currentId])

  if (items.length === 0) return null

  return (
    <section className="mt-16">
      <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">Seen</p>
      <h2
        className="font-serif font-light text-deep mb-8"
        style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', letterSpacing: '-0.01em' }}
      >
        Recently viewed
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
