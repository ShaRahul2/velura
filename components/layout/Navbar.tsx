'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, Heart, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { usePathname } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { AccountNavLink } from '@/components/account/AccountNavLink'
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
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen)
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
    const onScroll = () => {
      startTransition(() => setScrolled(window.scrollY > 16))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const solid = !isHome || scrolled

  return (
    <div
      className={cn(
        'flex h-16 items-center px-5 transition-[background-color,border-color] duration-200 ease-out md:px-8 lg:px-12',
        solid
          ? 'border-b border-nav-border bg-nav-bg backdrop-blur-[16px]'
          : 'border-b border-transparent bg-gradient-to-b from-deep/80 via-deep/40 to-transparent'
      )}
    >
      <Link
        href="/"
        className="mr-auto font-serif text-[1.18rem] tracking-logo text-blush lg:text-[1.28rem]"
      >
        VELURA
      </Link>

      <nav className="mr-6 hidden items-center gap-7 md:flex lg:gap-9">
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
                'font-sans text-[0.72rem] tracking-btn uppercase transition-colors duration-200 lg:text-[0.76rem]',
                isBuilder
                  ? 'text-rose hover:text-blush'
                  : active
                    ? 'text-nav-active'
                    : 'text-nav-text hover:text-blush'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-0.5 text-blush">
        <button
          onClick={openSearch}
          className="p-3 text-blush/70 transition-colors hover:text-blush"
          aria-label="Search collection"
        >
          <Search size={17} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <button
          onClick={openStylist}
          className="hidden items-center px-2 py-2 font-sans text-[0.68rem] tracking-btn uppercase text-blush/70 transition-colors hover:text-blush sm:flex"
        >
          Atelier
        </button>
        <AccountNavLink />
        <Link
          href="/wishlist"
          className="relative hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
          aria-label="Saved pieces"
        >
          <Heart size={17} strokeWidth={1.6} aria-hidden="true" />
          {mounted && wishCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 min-w-[15px] items-center justify-center rounded-full bg-rose px-1 font-sans text-[0.52rem] font-medium text-deep" aria-hidden="true">
              {wishCount}
            </span>
          )}
        </Link>

        <button
          onClick={openCart}
          className="relative hidden p-3 text-blush/70 transition-colors hover:text-blush md:flex"
          aria-label="Open bag"
        >
          <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" />
          {mounted && count > 0 && (
            <>
              <span className="absolute top-1 right-1 flex h-3.5 min-w-[15px] items-center justify-center rounded-full bg-rose px-1 font-sans text-[0.52rem] font-medium text-deep" aria-hidden="true">
                {count}
              </span>
              <span className="sr-only" role="status" aria-atomic="true">
                {count} {count === 1 ? 'item' : 'items'} in bag
              </span>
            </>
          )}
        </button>

        <button
          onClick={openMenu}
          className="ml-0.5 flex p-3 text-blush transition-colors hover:text-blush/70 md:hidden"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
