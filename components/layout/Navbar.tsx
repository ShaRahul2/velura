'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, Heart, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/shop',    label: 'Shop' },
  { href: '/builder', label: '✦ Custom Bra' },
]

export function Navbar() {
  const count      = useCartStore((s) => s.count())
  const openCart   = useUiStore((s) => s.openCart)
  const openMenu   = useUiStore((s) => s.openMobileMenu)
  const openSearch = useUiStore((s) => s.openSearch)
  const openStylist = useUiStore((s) => s.openStylist)
  const pathname   = usePathname()
  const [mounted, setMounted] = useState(false)
  const wishCount  = useWishlistStore((s) => s.ids.length)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className="h-16 flex items-center px-5 md:px-8 lg:px-12"
      style={{
        background:   'rgba(15,13,11,0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(184,168,152,0.18)',
      }}
    >
      <Link
        href="/"
        className="font-serif text-[1.12rem] lg:text-[1.22rem] tracking-logo mr-auto"
        style={{ color: '#EDE9E4' }}
      >
        VELURA
      </Link>

      <nav className="hidden md:flex items-center gap-8 mr-6">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="font-sans text-[0.72rem] lg:text-[0.76rem] tracking-btn uppercase transition-colors duration-200"
              style={{ color: active ? '#EDE9E4' : 'rgba(237,233,228,0.55)' }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-1">
        <button
          onClick={openSearch}
          className="p-2 transition-opacity hover:opacity-80"
          style={{ color: 'rgba(237,233,228,0.55)' }}
          aria-label="Search collection"
        >
          <Search size={17} />
        </button>
        <button
          onClick={openStylist}
          className="hidden sm:flex items-center px-2 py-2 font-sans text-[0.68rem] tracking-btn uppercase transition-opacity hover:opacity-80"
          style={{ color: 'rgba(237,233,228,0.55)' }}
        >
          Atelier
        </button>
        {mounted && wishCount > 0 && (
          <Link
            href="/shop"
            className="relative p-2 hidden sm:flex"
            style={{ color: 'rgba(237,233,228,0.55)' }}
            aria-label="Wishlist"
          >
            <Heart size={17} />
            <span
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[0.55rem] font-sans font-semibold px-1"
              style={{ background: '#B8A898', color: '#0F0D0B' }}
            >
              {wishCount}
            </span>
          </Link>
        )}

        <button
          onClick={openCart}
          className="relative p-2 transition-opacity hover:opacity-80"
          style={{ color: 'rgba(237,233,228,0.55)' }}
          aria-label="Open bag"
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

        <button
          onClick={openMenu}
          className="md:hidden ml-1 p-2"
          style={{ color: 'rgba(237,233,228,0.55)' }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  )
}
