'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import type { ProductCategory } from '@/types'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { shopHref, type ShopQuery } from '@/lib/shopQuery'
import { cn } from '@/lib/utils'

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
  open: boolean
  onClose: () => void
  query: ShopQuery
}

export function FilterDrawer({ open, onClose, query }: FilterDrawerProps) {
  const router = useRouter()
  const activeCat = query.cat ?? 'all'
  const activeSupport = query.support ?? ''
  const panelRef = useRef<HTMLElement>(null)
  useFocusTrap(open, panelRef, onClose)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function go(href: string) {
    router.push(href)
    onClose()
  }

  return (
    <>
      <div
        className="scrim fixed inset-0 z-40 md:hidden"
        data-open={open}
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className="drawer-panel fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-cream md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-hidden={!open}
        inert={!open || undefined}
        data-open={open}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: open ? '6px 0 32px rgba(15,13,11,0.14)' : 'none',
        }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-lm px-6">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-deep lg:text-[0.72rem]">Filters</p>
          <button type="button" onClick={onClose} className="p-2 text-mauve transition-colors hover:text-deep" aria-label="Close filters">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <div>
            <p className="mb-4 font-sans text-[0.65rem] tracking-label uppercase text-rose lg:text-[0.7rem]">Category</p>
            <ul className="flex flex-col gap-1">
              {CATEGORIES.map(({ id, label }) => {
                const active = activeCat === id
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => go(shopHref(query, { cat: id === 'all' ? '' : id }))}
                      className={cn(
                        'w-full py-2.5 text-left font-sans text-[0.85rem] transition-colors lg:text-[0.9rem]',
                        active ? 'font-medium text-deep' : 'font-light text-mauve'
                      )}
                      aria-pressed={active}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-sans text-[0.65rem] tracking-label uppercase text-rose lg:text-[0.7rem]">Support</p>
            <ul className="flex flex-col gap-1">
              {SUPPORT.map((level) => {
                const active = activeSupport === level
                return (
                  <li key={level}>
                    <button
                      type="button"
                      onClick={() => go(shopHref(query, { support: active ? '' : level }))}
                      className={cn(
                        'w-full py-2 text-left font-sans text-[0.85rem] transition-colors lg:text-[0.9rem]',
                        active ? 'font-medium text-deep' : 'font-light text-mauve'
                      )}
                      aria-pressed={active}
                    >
                      {level}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="shrink-0 border-t border-lm px-6 py-5">
          <button
            type="button"
            onClick={() => go('/shop')}
            className="pressable h-10 w-full rounded-btn border border-lm font-sans text-[0.75rem] tracking-btn uppercase text-mauve hover:border-deep hover:text-deep lg:text-[0.8rem]"
          >
            Clear all filters
          </button>
        </div>
      </aside>
    </>
  )
}
