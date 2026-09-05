import type { Metadata } from 'next'
import { queryProducts } from '@/lib/products'
import { products as staticProducts } from '@/data/products'
import { WishlistGrid } from '@/components/shop/WishlistGrid'
import { withTimeout } from '@/lib/utils'
import { clerkConfigured } from '@/lib/clerkEnv'
import { requireSignedInProfile } from '@/lib/requireCustomer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Saved',
  description: 'Pieces you kept. Velura.',
  robots: { index: false, follow: false },
}

export default async function WishlistPage() {
  if (clerkConfigured()) {
    await requireSignedInProfile()
  }

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
