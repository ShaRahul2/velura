import Link from 'next/link'
import { db } from '@/lib/db'
import { products as staticProducts } from '@/data/products'
import { ProductCard } from '@/components/shop/ProductCard'
import { mapDbProductToProduct } from '@/lib/products'
import type { Product } from '@/types'

const FEATURED_IDS = [1, 4, 6, 12]

export async function FeaturedProducts() {
  let sorted: Product[]

  try {
    const rows = await db.product.findMany({
      where:   { id: { in: FEATURED_IDS }, isActive: true },
      include: { category: true, images: { orderBy: { position: 'asc' } } },
      orderBy: { id: 'asc' },
    })
    sorted = FEATURED_IDS
      .map((id) => rows.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
      .map(mapDbProductToProduct)
  } catch {
    // DB not yet provisioned — fall back to static catalog
    sorted = FEATURED_IDS
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }

  if (sorted.length === 0) return null

  return (
    <section className="py-20 lg:py-24 2xl:py-28 px-6 md:px-10 max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Bestsellers
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)', letterSpacing: '-0.01em' }}
          >
            The ones they come back for.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:block font-sans text-[0.78rem] lg:text-[0.84rem] tracking-btn uppercase text-mauve hover:text-deep transition-colors underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 2xl:gap-x-10">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          href="/shop"
          className="font-sans text-[0.78rem] lg:text-[0.84rem] tracking-btn uppercase text-mauve hover:text-deep transition-colors underline underline-offset-4"
        >
          View all →
        </Link>
      </div>
    </section>
  )
}
