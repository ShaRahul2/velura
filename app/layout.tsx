import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { StorefrontFrame } from '@/components/layout/StorefrontFrame'
import { siteUrl } from '@/lib/site'

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

const site = siteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: 'VELURA — Crafted for the Woman Who Knows',
    template: '%s — VELURA',
  },
  description: 'Premium Indian lingerie. 26AA–52K. Everyday, lace, bridal, and made-to-measure.',
  openGraph: {
    title: 'VELURA — Crafted for the Woman Who Knows',
    description: 'Premium Indian lingerie. 26AA–52K.',
    url: site,
    siteName: 'VELURA',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/hero/campaign.jpg', width: 1200, height: 1600, alt: 'VELURA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELURA — Crafted for the Woman Who Knows',
    description: 'Premium Indian lingerie. 26AA–52K.',
    images: ['/images/hero/campaign.jpg'],
  },
  robots: { index: true, follow: true },
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
