'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useEffect } from 'react'

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/shop',    label: 'Shop' },
  { href: '/builder', label: '✦ Custom Bra' },
]

const CATS = [
  { href: '/shop?cat=everyday', label: 'Everyday' },
  { href: '/shop?cat=lace',     label: 'Lace' },
  { href: '/shop?cat=bridal',   label: 'Bridal' },
  { href: '/shop?cat=plus',     label: 'Plus' },
]

export function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu, openSearch, openStylist } = useUiStore()

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  if (!mobileMenuOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(15,13,11,0.97)' }}>
      <div className="flex items-center justify-between px-5 h-16 border-b border-[rgba(184,168,152,0.18)]">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="font-serif text-[1.1rem] tracking-logo"
          style={{ color: '#EDE9E4' }}
        >
          VELURA
        </Link>
        <button
          onClick={closeMobileMenu}
          className="p-2"
          style={{ color: 'rgba(237,233,228,0.55)' }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col px-5 py-6 gap-1">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMobileMenu}
            className="py-3.5 font-sans text-[0.92rem] tracking-[0.12em] uppercase border-b border-[rgba(184,168,152,0.12)]"
            style={{ color: 'rgba(237,233,228,0.8)' }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-5">
        <p className="font-sans text-[0.62rem] tracking-label uppercase mb-3" style={{ color: '#B8A898' }}>
          Collections
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CATS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              className="py-3 px-3 font-sans text-[0.78rem] tracking-btn uppercase"
              style={{
                color: 'rgba(237,233,228,0.7)',
                border: '1px solid rgba(184,168,152,0.18)',
                borderRadius: 3,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-5 pb-12 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            closeMobileMenu()
            openSearch()
          }}
          className="w-full py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase"
          style={{ border: '1px solid rgba(184,168,152,0.35)', color: '#EDE9E4' }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            closeMobileMenu()
            openStylist()
          }}
          className="w-full py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase"
          style={{ border: '1px solid rgba(184,168,152,0.35)', color: '#EDE9E4' }}
        >
          Ask Atelier
        </button>
        <Link
          href="/builder"
          onClick={closeMobileMenu}
          className="block w-full text-center py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase"
          style={{ background: '#B8A898', color: '#0F0D0B' }}
        >
          Build Yours
        </Link>
      </div>
    </div>
  )
}
