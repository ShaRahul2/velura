'use client'

import { usePathname } from 'next/navigation'
import { AnnouncementBar } from './AnnouncementBar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'

export function StorefrontFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isBuilder = pathname.startsWith('/builder')

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
      <ToastContainer />
    </>
  )
}
