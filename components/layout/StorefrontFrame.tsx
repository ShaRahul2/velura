'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { AnnouncementBar } from './AnnouncementBar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { StylistDrawer } from '@/components/stylist/StylistDrawer'

export function StorefrontFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isBuilder = pathname.startsWith('/builder')
  const count = useCartStore((s) => s.count())

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
      <header className="fixed top-0 inset-x-0 z-40">
        <AnnouncementBar />
        <Navbar />
      </header>
      <main className="pt-24">{children}</main>
      {!isBuilder && <Footer />}
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <StylistDrawer />
      <ToastContainer />
    </>
  )
}
