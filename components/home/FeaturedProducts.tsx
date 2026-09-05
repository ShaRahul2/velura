import Link from 'next/link'
import { db } from '@/lib/db'
import { products as staticProducts } from '@/data/products'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { mapDbProductToProduct } from '@/lib/products'
import { pageWrap, withTimeout } from '@/lib/utils'
import type { Product } from '@/types'

const FEATURED_IDS = [1, 4, 6, 12]

export async function FeaturedProducts() {
  let sorted: Product[]

  try {
    const rows = await withTimeout(
      db.product.findMany({
        where:   { id: { in: FEATURED_IDS }, isActive: true },
        include: { category: true, images: { orderBy: { position: 'asc' } } },
        orderBy: { id: 'asc' },
      }),
      2500,
      'featured-timeout'
    )
    sorted = FEATURED_IDS
      .map((id) => rows.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
      .map(mapDbProductToProduct)
  } catch {
    sorted = FEATURED_IDS
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }

  if (sorted.length === 0) return null

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className={pageWrap}>
        <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
          <div className="max-w-2xl">
            <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
              Bestsellers
            </p>
            <h2
              className="font-serif font-light text-deep"
              style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)', letterSpacing: '-0.01em' }}
            >
              The ones they come back for.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden font-sans text-[0.78rem] tracking-btn uppercase text-mauve underline underline-offset-4 transition-colors hover:text-deep md:block"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/shop"
            className="font-sans text-[0.78rem] tracking-btn uppercase text-mauve underline underline-offset-4 transition-colors hover:text-deep"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  )
}

export function FeaturedProductsSkeleton() {
  return (
    <section className={`bg-cream py-20 md:py-28 ${pageWrap}`} aria-hidden="true">
      <div className="mb-10 md:mb-14">
        <div className="mb-3 h-3 w-24 bg-blush" />
        <div className="h-10 w-64 max-w-full bg-blush" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
