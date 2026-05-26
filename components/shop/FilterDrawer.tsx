'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { X } from 'lucide-react'
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

interface FilterDrawerProps {
  open:    boolean
  onClose: () => void
}

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const activeCat     = searchParams.get('cat') ?? 'all'
  const activeSupport = searchParams.get('support') ?? ''

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') params.delete(key)
    else params.set(key, value)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `/shop?${qs}` : '/shop')
  }

  function clearAll() {
    router.push('/shop')
    onClose()
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(15,13,11,0.55)' }}
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-cream md:hidden"
        style={{
          transform:  open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.23,1,0.32,1)',
          boxShadow:  open ? '6px 0 32px rgba(15,13,11,0.14)' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-lm shrink-0">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-deep">Filters</p>
          <button onClick={onClose} className="p-2 text-mauve hover:text-deep transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Category */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-label uppercase text-rose mb-4">Category</p>
            <ul className="flex flex-col gap-1">
              {CATEGORIES.map(({ id, label }) => {
                const active = activeCat === id
                return (
                  <li key={id}>
                    <button
                      onClick={() => { setParam('cat', id); onClose() }}
                      className="w-full text-left font-sans text-[0.85rem] py-2 transition-colors"
                      style={{ color: active ? '#0F0D0B' : '#6B6058', fontWeight: active ? 500 : 300 }}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-label uppercase text-rose mb-4">Support</p>
            <ul className="flex flex-col gap-1">
              {SUPPORT.map((level) => {
                const active = activeSupport === level
                return (
                  <li key={level}>
                    <button
                      onClick={() => { setParam('support', active ? '' : level); onClose() }}
                      className="w-full text-left font-sans text-[0.85rem] py-2 transition-colors"
                      style={{ color: active ? '#0F0D0B' : '#6B6058', fontWeight: active ? 500 : 300 }}
                    >
                      {level}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Footer — clear all */}
        <div className="px-6 py-5 border-t border-lm shrink-0">
          <button
            onClick={clearAll}
            className="w-full h-10 font-sans text-[0.75rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
            style={{ borderRadius: 3 }}
          >
            Clear all filters
          </button>
        </div>
      </aside>
    </>
  )
}
