'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { SearchHit } from '@/lib/catalogSearch'

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUiStore()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useFocusTrap(searchOpen, rootRef, closeSearch)

  useEffect(() => {
    if (!searchOpen) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const query = q.trim()
    if (query.length < 2) return
    const handle = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const json = (await res.json()) as { data?: SearchHit[] }
        setHits(json.data ?? [])
      } catch {
        setHits([])
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => window.clearTimeout(handle)
  }, [q, searchOpen])

  function goShop(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (query.length < 2) return
    closeSearch()
    router.push(`/shop?q=${encodeURIComponent(query)}`)
  }

  if (!searchOpen) return null

  const querying = q.trim().length >= 2
  const results = querying ? hits : []

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 bg-cream flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search collection"
      aria-busy={loading}
    >
      <div className="h-16 flex items-center px-5 md:px-8 lg:px-12 border-b border-lm">
        <form onSubmit={goShop} className="flex-1 flex items-center gap-3">
          <Search size={18} className="text-mauve shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="flex-1 bg-transparent font-serif text-[1.2rem] md:text-[1.4rem] font-light text-deep outline-none placeholder:text-mauve/60 focus-visible:outline-none"
          />
        </form>
        <button
          type="button"
          onClick={closeSearch}
          className="p-3 text-mauve hover:text-deep"
          aria-label="Close search"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 lg:px-12 py-8 max-w-[1280px] w-full mx-auto">
        {!querying && (
          <p className="font-sans text-[0.84rem] text-mauve">
            Name, colour, fabric, or the hour you are dressing for.
          </p>
        )}
        {querying && loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}
        {querying && !loading && results.length === 0 && (
          <div>
            <p className="font-serif text-[1.4rem] font-light text-deep mb-3">
              Nothing in this cut.
            </p>
            <p className="font-sans text-[0.86rem] text-mauve mb-6">
              Try another word, or open the full collection.
            </p>
            <Link
              href="/shop"
              onClick={closeSearch}
              className="font-sans text-[0.78rem] tracking-btn uppercase underline underline-offset-4 text-deep"
            >
              View all
            </Link>
          </div>
        )}
        {querying && !loading && results.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {results.map((hit) => (
              <li key={hit.id}>
                <Link href={`/shop/${hit.id}`} onClick={closeSearch} className="group block">
                  <span
                    className="block aspect-[3/4] bg-blush bg-cover bg-center mb-3"
                    style={{ backgroundImage: `url(${hit.image})` }}
                  />
                  <span className="block font-serif text-[1.02rem] text-deep group-hover:opacity-70">
                    {hit.name}
                  </span>
                  <span className="block font-sans text-[0.86rem] text-deep mt-0.5">
                    {formatPrice(hit.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
