import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/ShopContent'
import { queryProducts } from '@/lib/products'
import { products as staticProducts } from '@/data/products'
import type { Product, ProductCategory } from '@/types'

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

  let products
  let total

  try {
    const result = await queryProducts({ cat, support, sort, page })
    products = result.data
    total = result.total
  } catch {
    let fallback: Product[] = staticProducts
    if (cat) fallback = fallback.filter((p) => p.cat === (cat as ProductCategory))
    if (support) fallback = fallback.filter((p) => p.support === support)
    products = fallback
    total = fallback.length
  }

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
