'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { MobileDock } from './MobileDock'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { StylistDrawer } from '@/components/stylist/StylistDrawer'
import { cn } from '@/lib/utils'

export function StorefrontFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isBuilder = pathname.startsWith('/builder')
  const isHome = pathname === '/'
  const isProduct = /^\/shop\/[^/]+/.test(pathname)
  const isCheckout =
    pathname.startsWith('/checkout') || pathname.startsWith('/order-confirmed')
  const count = useCartStore((s) => s.count())
  const showDock = !isAdmin && !isBuilder && !isCheckout && !isProduct

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const raw = document.title.replace(/^\(\d+\)\s/, '')
      document.title = count > 0 ? `(${count}) ${raw}` : raw
    })
    return () => cancelAnimationFrame(id)
  }, [count, pathname])

  if (isAdmin) return <>{children}</>

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[70] focus:top-3 focus:left-3 focus:bg-deep focus:text-blush focus:px-4 focus:py-2 focus:font-sans focus:text-[0.8rem] focus:tracking-btn focus:uppercase"
      >
        Skip to content
      </a>
      <header className="fixed top-0 inset-x-0 z-40">
        <Navbar />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'outline-none',
          isHome ? 'pt-0' : 'pt-16',
          showDock && 'pb-16 md:pb-0'
        )}
      >
        {children}
      </main>
      {!isBuilder && <Footer />}
      <MobileMenu />
      <MobileDock />
      <CartDrawer />
      <SearchOverlay />
      <StylistDrawer />
      <ToastContainer />
    </>
  )
}
