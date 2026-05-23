import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ToastContainer } from '@/components/ui/Toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VELURA — Crafted for the Woman Who Knows',
  description: 'Premium Indian lingerie. XS–4XL, 28AA–50H. Crafted for every body.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream text-deep font-sans antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <MobileMenu />
        <CartDrawer />
        <ToastContainer />
      </body>
    </html>
  )
}
