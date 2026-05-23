import Link from 'next/link'
import { products } from '@/data/products'
import { ProductCard } from '@/components/shop/ProductCard'

const FEATURED_IDS = [1, 4, 6, 12]

export function FeaturedProducts() {
  const featured = products.filter((p) => FEATURED_IDS.includes(p.id))

  return (
    <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
      {/* Header */}
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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile CTA */}
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
