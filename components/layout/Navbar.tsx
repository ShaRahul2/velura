'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, Heart, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?cat=everyday', label: 'Everyday' },
  { href: '/shop?cat=bridal', label: 'Bridal' },
  { href: '/builder', label: '✦ Custom Bra' },
]

export function Navbar() {
  const count = useCartStore((s) => s.count())
  const openCart = useUiStore((s) => s.openCart)
  const openMenu = useUiStore((s) => s.openMobileMenu)
  const openSearch = useUiStore((s) => s.openSearch)
  const openStylist = useUiStore((s) => s.openStylist)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const wishCount = useWishlistStore((s) => s.ids.length)
  const isHome = pathname === '/'

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const solid = !isHome || scrolled

  return (
    <div
      className={cn(
        'h-16 flex items-center px-5 md:px-8 lg:px-12 transition-[background-color,border-color,box-shadow] duration-300',
        solid
          ? 'bg-cream/92 backdrop-blur-xl border-b border-lm/80 shadow-[0_1px_0_rgba(15,13,11,0.04)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <Link
        href="/"
        className="font-serif text-[1.18rem] lg:text-[1.28rem] tracking-logo text-deep mr-auto"
      >
        VELURA
      </Link>

      <nav className="hidden md:flex items-center gap-7 lg:gap-9 mr-6">
        {NAV_LINKS.map(({ href, label }) => {
          const isBuilder = href === '/builder'
          const active = isBuilder
            ? pathname.startsWith('/builder')
            : href === '/shop' && pathname.startsWith('/shop')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'font-sans text-[0.72rem] lg:text-[0.76rem] tracking-btn uppercase transition-colors duration-200',
                isBuilder
                  ? 'text-rose hover:text-deep'
                  : active
                    ? 'text-deep'
                    : 'text-deep/55 hover:text-deep'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-0.5 text-deep">
        <button
          onClick={openSearch}
          className="p-2.5 text-deep/70 hover:text-deep transition-colors"
          aria-label="Search collection"
        >
          <Search size={17} strokeWidth={1.6} />
        </button>
        <button
          onClick={openStylist}
          className="hidden sm:flex items-center px-2 py-2 font-sans text-[0.68rem] tracking-btn uppercase text-deep/70 hover:text-deep transition-colors"
        >
          Atelier
        </button>
        {mounted && wishCount > 0 && (
          <Link
            href="/shop"
            className="relative p-2.5 hidden sm:flex text-deep/70 hover:text-deep transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={17} strokeWidth={1.6} />
            <span className="absolute top-1 right-1 min-w-[15px] h-3.5 flex items-center justify-center rounded-full text-[0.52rem] font-sans font-medium px-1 bg-deep text-blush">
              {wishCount}
            </span>
          </Link>
        )}

        <button
          onClick={openCart}
          className="relative hidden md:flex p-2.5 text-deep/70 hover:text-deep transition-colors"
          aria-label="Open bag"
        >
          <ShoppingBag size={18} strokeWidth={1.6} />
          {mounted && count > 0 && (
            <span className="absolute top-1 right-1 min-w-[15px] h-3.5 flex items-center justify-center rounded-full text-[0.52rem] font-sans font-medium px-1 bg-deep text-blush">
              {count}
            </span>
          )}
        </button>

        <button
          onClick={openMenu}
          className="flex md:hidden ml-0.5 p-2.5 text-deep hover:text-deep/70 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
