'use client'

import Link from 'next/link'
import { ShoppingBag, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/shop',    label: 'Collections' },
  { href: '/builder', label: '✦ Custom Bra' },
]

export function Navbar() {
  const count      = useCartStore((s) => s.count())
  const openCart   = useUiStore((s) => s.openCart)
  const openMenu   = useUiStore((s) => s.openMobileMenu)
  const pathname   = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-16 flex items-center px-6 md:px-10 border-b"
      style={{
        background:   'rgba(15,13,11,0.96)',
        backdropFilter: 'blur(16px)',
        borderColor:  'rgba(184,168,152,0.18)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-[1.08rem] tracking-logo mr-auto"
        style={{ color: '#EDE9E4' }}
      >
        VELURA
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8 mr-8">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="font-sans text-[0.72rem] tracking-btn uppercase transition-colors duration-200"
              style={{ color: active ? '#EDE9E4' : 'rgba(237,233,228,0.55)' }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Cart */}
      <button
        onClick={openCart}
        className="relative p-2 transition-opacity hover:opacity-80"
        style={{ color: 'rgba(237,233,228,0.55)' }}
        aria-label="Open cart"
      >
        <ShoppingBag size={18} />
        {mounted && count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[0.55rem] font-sans font-semibold px-1"
            style={{ background: '#B8A898', color: '#0F0D0B' }}
          >
            {count}
          </span>
        )}
      </button>

      {/* Mobile hamburger */}
      <button
        onClick={openMenu}
        className="md:hidden ml-3 p-2"
        style={{ color: 'rgba(237,233,228,0.55)' }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </header>
  )
}
