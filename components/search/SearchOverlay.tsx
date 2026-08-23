'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import type { SearchHit } from '@/lib/catalogSearch'

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUiStore()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!searchOpen) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [searchOpen, closeSearch])

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

  return (
    <div
      className="fixed inset-0 z-50 bg-cream flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search collection"
    >
      <div className="h-16 flex items-center px-5 md:px-8 lg:px-12 border-b border-lm">
        <form onSubmit={goShop} className="flex-1 flex items-center gap-3">
          <Search size={18} className="text-mauve shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the collection"
            className="flex-1 bg-transparent font-serif text-[1.2rem] md:text-[1.4rem] font-light text-deep outline-none placeholder:text-mauve/60"
          />
        </form>
        <button
          type="button"
          onClick={closeSearch}
          className="p-2 text-mauve hover:text-deep"
          aria-label="Close search"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 lg:px-12 py-8 max-w-[1280px] w-full mx-auto">
        {q.trim().length < 2 && (
          <p className="font-sans text-[0.84rem] text-mauve">
            Name, colour, fabric, or the hour you are dressing for.
          </p>
        )}
        {q.trim().length >= 2 && !loading && hits.length === 0 && (
          <p className="font-serif text-[1.4rem] font-light text-deep">Nothing in this cut. Try another word.</p>
        )}
        {q.trim().length >= 2 && hits.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {hits.map((hit) => (
              <li key={hit.id}>
                <Link href={`/shop/${hit.id}`} onClick={closeSearch} className="group block">
                  <span
                    className="block aspect-[3/4] rounded-card bg-blush bg-cover bg-center mb-3"
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
