'use client'

import { useSearchParams } from 'next/navigation'
import type { ProductCategory } from '@/types'

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'pushup',   label: 'Push-Up' },
  { id: 'lace',     label: 'Lace' },
  { id: 'sports',   label: 'Sports' },
  { id: 'seamless', label: 'Seamless' },
  { id: 'plus',     label: 'Plus' },
  { id: 'bridal',   label: 'Bridal' },
]

const SUPPORT = ['Light', 'Medium', 'High']

export function FilterSidebar() {
  const pathname = '/shop'
  const searchParams = useSearchParams()
  const activeCat = searchParams.get('cat') ?? 'all'
  const activeSupport = searchParams.get('support') ?? ''

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page')
    window.history.pushState(null, '', `${pathname}?${params.toString()}`)
    window.dispatchEvent(new Event('popstate'))
  }

  return (
    <aside className="hidden md:block w-52 shrink-0">
      {/* Category */}
      <div className="mb-8">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
          Category
        </p>
        <ul className="flex flex-col gap-0.5">
          {CATEGORIES.map(({ id, label }) => {
            const active = activeCat === id
            return (
              <li key={id}>
                <button
                  onClick={() => setParam('cat', id)}
                  className="w-full text-left font-sans text-[0.82rem] py-1.5 transition-colors"
                  style={{
                    color: active ? '#0F0D0B' : '#6B6058',
                    fontWeight: active ? 500 : 300,
                  }}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Support level */}
      <div>
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
          Support
        </p>
        <ul className="flex flex-col gap-0.5">
          {SUPPORT.map((level) => {
            const active = activeSupport === level
            return (
              <li key={level}>
                <button
                  onClick={() => setParam('support', active ? '' : level)}
                  className="w-full text-left font-sans text-[0.82rem] py-1.5 transition-colors"
                  style={{
                    color: active ? '#0F0D0B' : '#6B6058',
                    fontWeight: active ? 500 : 300,
                  }}
                >
                  {level}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
