import Link from 'next/link'
import { db } from '@/lib/db'
import { products as staticProducts } from '@/data/products'
import { ProductCard } from '@/components/shop/ProductCard'
import { mapDbProductToProduct } from '@/lib/products'
import { pageWrap } from '@/lib/utils'
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
    sorted = FEATURED_IDS
      .map((id) => staticProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined)
  }

  if (sorted.length === 0) return null

  return (
    <section className={`py-16 md:py-20 lg:py-24 ${pageWrap}`}>
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Bestsellers
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.01em' }}
          >
            The ones they come back for.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:block font-sans text-[0.78rem] tracking-btn uppercase text-mauve hover:text-deep transition-colors underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/shop"
          className="font-sans text-[0.78rem] tracking-btn uppercase text-mauve hover:text-deep transition-colors underline underline-offset-4"
        >
          View all →
        </Link>
      </div>
    </section>
  )
}
