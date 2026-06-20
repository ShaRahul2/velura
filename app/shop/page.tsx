import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/ShopContent'
import { queryProducts } from '@/lib/products'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Shop — VELURA',
  description: 'Explore the full Velura collection. 26AA–52K. Everyday, sports, lace, bridal, and more.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp  = await searchParams
  const cat     = typeof sp.cat     === 'string' ? sp.cat     : undefined
  const support = typeof sp.support === 'string' ? sp.support : undefined
  const sort    = typeof sp.sort    === 'string' ? sp.sort    : undefined
  const page    = typeof sp.page    === 'string' ? Number(sp.page) : 1

  const { data: products, total } = await queryProducts({ cat, support, sort, page })

  return (
    <Suspense>
      <ShopContent
        initialProducts={products}
        total={total}
        currentPage={page}
        currentCat={cat}
      />
    </Suspense>
  )
}
