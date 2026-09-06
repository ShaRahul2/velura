import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/ShopContent'
import { getActiveCatalog } from '@/lib/products'
import { products as staticProducts } from '@/data/products'
import { withTimeout, pageWrap } from '@/lib/utils'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'

export const revalidate = 3600
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Explore the full Velura collection. 26AA–52K. Everyday, sports, lace, bridal, and more.',
}

export default async function ShopPage() {
  let products: Product[]

  try {
    products = await withTimeout(getActiveCatalog(), 4000, 'shop-timeout')
  } catch {
    products = staticProducts.filter((p) => p.isActive !== false)
  }

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent catalog={products} />
    </Suspense>
  )
}

function ShopFallback() {
  return (
    <div className={`${pageWrap} pt-10 md:pt-14 lg:pt-16 pb-16`} aria-hidden="true">
      <div className="mb-3 h-3 w-16 bg-blush" />
      <div className="mb-10 h-10 w-56 bg-blush" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
