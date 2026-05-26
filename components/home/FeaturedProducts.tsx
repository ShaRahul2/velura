import Link from 'next/link'
import { db } from '@/lib/db'
import { ProductCard } from '@/components/shop/ProductCard'
import { mapDbProductToProduct } from '@/lib/products'

const FEATURED_IDS = [1, 4, 6, 12]

export async function FeaturedProducts() {
  const rows = await db.product.findMany({
    where:   { id: { in: FEATURED_IDS }, isActive: true },
    include: { category: true, images: { orderBy: { position: 'asc' } } },
    orderBy: { id: 'asc' },
  })

  // Preserve the intended curation order
  const sorted = FEATURED_IDS
    .map((id) => rows.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => r !== undefined)
    .map(mapDbProductToProduct)

  if (sorted.length === 0) return null

  return (
    <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Bestsellers
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.9rem)', letterSpacing: '-0.01em' }}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
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
