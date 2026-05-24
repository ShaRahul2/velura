import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/ShopContent'

export const metadata: Metadata = {
  title: 'Shop — VELURA',
  description: 'Explore the full Velura collection. 28AA–50H. Everyday, sports, lace, bridal, and more.',
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
