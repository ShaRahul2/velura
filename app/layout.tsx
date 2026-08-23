import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { StorefrontFrame } from '@/components/layout/StorefrontFrame'

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
  description: 'Premium Indian lingerie. XS–4XL, 26AA–52K. Crafted for every body.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream text-deep font-sans antialiased">
        <StorefrontFrame>{children}</StorefrontFrame>
      </body>
    </html>
  )
}
