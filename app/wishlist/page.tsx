import type { Metadata } from 'next'
import { queryProducts } from '@/lib/products'
import { products as staticProducts } from '@/data/products'
import { WishlistGrid } from '@/components/shop/WishlistGrid'
import { withTimeout } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Saved',
  description: 'Pieces you kept. Velura.',
}

export default async function WishlistPage() {
  let catalog = staticProducts
  try {
    const result = await withTimeout(
      queryProducts({ limit: 50, page: 1 }),
      4000,
      'wishlist-timeout',
    )
    if (result.data.length > 0) catalog = result.data
  } catch {
    catalog = staticProducts
  }

  return <WishlistGrid catalog={catalog} />
}
