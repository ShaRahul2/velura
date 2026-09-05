'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useEffect, useRef } from 'react'
import { useFocusTrap } from '@/lib/useFocusTrap'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/builder', label: '✦ Custom Bra' },
  { href: '/wishlist', label: 'Saved' },
  { href: '/account', label: 'Account' },
]

const CATS = [
  { href: '/shop?cat=everyday', label: 'Everyday' },
  { href: '/shop?cat=lace', label: 'Lace' },
  { href: '/shop?cat=bridal', label: 'Bridal' },
  { href: '/shop?cat=plus', label: 'Plus' },
  { href: '/shop?cat=seamless', label: 'Seamless' },
  { href: '/shop?cat=sports', label: 'Sports' },
]

export function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu, openSearch, openStylist } = useUiStore()
  const rootRef = useRef<HTMLDivElement>(null)
  useFocusTrap(mobileMenuOpen, rootRef, closeMobileMenu)

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  if (!mobileMenuOpen) return null

  return (
    <div
      id="mobile-menu"
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col bg-deep"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="font-serif text-[1.14rem] tracking-logo text-blush"
        >
          VELURA
        </Link>
        <button
          onClick={closeMobileMenu}
          className="p-2.5 text-blush/60 hover:text-blush"
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>

      <nav className="flex flex-col px-5 pt-8 pb-4">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMobileMenu}
            className="py-3 font-serif text-[2rem] font-light text-blush leading-none tracking-[-0.02em]"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-5 mt-4">
        <p className="font-sans text-[0.62rem] tracking-label uppercase text-rose mb-4">
          Collections
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CATS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              className="py-3 px-3 font-sans text-[0.78rem] tracking-btn uppercase text-blush/70 border border-white/12"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-5 pb-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            closeMobileMenu()
            openSearch()
          }}
          className="w-full py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase border border-white/20 text-blush"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            closeMobileMenu()
            openStylist()
          }}
          className="w-full py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase border border-white/20 text-blush"
        >
          Ask Atelier
        </button>
        <Link
          href="/builder"
          onClick={closeMobileMenu}
          className="block w-full text-center py-3.5 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase bg-rose text-deep"
        >
          Build Yours
        </Link>
      </div>
    </div>
  )
}
