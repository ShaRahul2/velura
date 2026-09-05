'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Search, Sparkles, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

export function MobileDock() {
  const pathname = usePathname()
  const count = useCartStore((s) => s.count())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  const openSearch = useUiStore((s) => s.openSearch)
  const openCart = useUiStore((s) => s.openCart)
  const cartOpen = useUiStore((s) => s.cartOpen)
  const searchOpen = useUiStore((s) => s.searchOpen)
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen)
  const stylistOpen = useUiStore((s) => s.stylistOpen)

  const hidden =
    cartOpen ||
    searchOpen ||
    mobileMenuOpen ||
    stylistOpen ||
    pathname.startsWith('/builder') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order-confirmed') ||
    pathname.startsWith('/admin') ||
    /^\/shop\/[^/]+/.test(pathname)

  if (hidden) return null

  const shopActive = pathname === '/shop' || pathname.startsWith('/shop/')
  const builderActive = pathname.startsWith('/builder')

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-nav-border bg-nav-bg backdrop-blur-[16px] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <div className="grid grid-cols-4 h-14">
        <Link
          href="/shop"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 font-sans text-[0.58rem] tracking-[0.12em] uppercase',
            shopActive ? 'text-blush' : 'text-blush/45'
          )}
        >
          <LayoutGrid size={18} strokeWidth={1.6} aria-hidden="true" />
          Shop
        </Link>
        <button
          type="button"
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-0.5 font-sans text-[0.58rem] tracking-[0.12em] uppercase text-blush/45"
        >
          <Search size={18} strokeWidth={1.6} aria-hidden="true" />
          Search
        </button>
        <Link
          href="/builder"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 font-sans text-[0.58rem] tracking-[0.12em] uppercase',
            builderActive ? 'text-rose' : 'text-blush/45'
          )}
        >
          <Sparkles size={18} strokeWidth={1.6} aria-hidden="true" />
          Custom
        </Link>
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 font-sans text-[0.58rem] tracking-[0.12em] uppercase text-blush/45"
        >
          <span className="relative">
            <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" />
            {mounted && count > 0 && (
              <>
                <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose px-0.5 font-sans text-[0.5rem] font-medium text-deep" aria-hidden="true">
                  {count}
                </span>
                <span className="sr-only" role="status" aria-atomic="true">
                  {count} {count === 1 ? 'item' : 'items'} in bag
                </span>
              </>
            )}
          </span>
          Bag
        </button>
      </div>
    </nav>
  )
}
