import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopContent } from '@/components/shop/ShopContent'
import { queryProducts } from '@/lib/products'
import { products as staticProducts } from '@/data/products'
import { withTimeout, pageWrap } from '@/lib/utils'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product, ProductCategory } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Explore the full Velura collection. 26AA–52K. Everyday, sports, lace, bridal, and more.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function parseParams(sp: Record<string, string | string[] | undefined>) {
  return {
    cat: typeof sp.cat === 'string' ? sp.cat : undefined,
    support: typeof sp.support === 'string' ? sp.support : undefined,
    sort: typeof sp.sort === 'string' ? sp.sort : undefined,
    q: typeof sp.q === 'string' ? sp.q.trim() : undefined,
    page: typeof sp.page === 'string' ? Number(sp.page) : 1,
  }
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = parseParams(await searchParams)

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopResults {...params} />
    </Suspense>
  )
}

async function ShopResults({
  cat,
  support,
  sort,
  q,
  page,
}: ReturnType<typeof parseParams>) {
  let products
  let total

  try {
    const result = await withTimeout(
      queryProducts({ cat, support, sort, q, page }),
      4000,
      'shop-timeout'
    )
    products = result.data
    total = result.total
  } catch {
    let fallback: Product[] = staticProducts
    if (cat) fallback = fallback.filter((p) => p.cat === (cat as ProductCategory))
    if (support) fallback = fallback.filter((p) => p.support === support)
    if (q) {
      const { searchCatalog } = await import('@/lib/catalogSearch')
      fallback = searchCatalog(q, fallback)
    }
    products = fallback
    total = fallback.length
  }

  return (
    <ShopContent
      initialProducts={products}
      total={total}
      currentPage={page}
      currentCat={cat}
      query={q}
    />
  )
}

function ShopFallback() {
  return (
    <div className={`${pageWrap} pt-10 md:pt-14 lg:pt-16 pb-16`} aria-hidden="true">
      <div className="h-3 w-16 bg-blush mb-3" />
      <div className="h-10 w-56 bg-blush mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
