import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts, getAllProductIds } from '@/lib/products'
import { ProductView } from '@/components/product/ProductView'
import { ProductCard } from '@/components/shop/ProductCard'
import { pageWrap } from '@/lib/utils'
import type { ProductCategory } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

// React cache() deduplicates this call within a single request —
// generateMetadata and the page component both call it but only one DB query runs.
const getCachedProduct = cache((id: number) => getProductById(id))

export async function generateStaticParams() {
  const ids = await getAllProductIds()
  return ids.map((id) => ({ id: String(id) }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = await getCachedProduct(Number(id))
  if (!product) return {}
  return {
    title:       `${product.name} — VELURA`,
    description: product.story,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  // getCachedProduct is deduplicated — generateMetadata already called it,
  // so this resolves instantly from React's request cache (no second DB query).
  const product = await getCachedProduct(Number(id))
  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.cat as ProductCategory)

  return (
    <div className={`${pageWrap} py-10 md:py-14 lg:py-16`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 mb-20">
        <ProductView product={product} />
      </div>

      {related.length > 0 && (
        <section>
          <div className="mb-8">
            <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">
              You may also like
            </p>
            <h2
              className="font-serif font-light text-deep"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', letterSpacing: '-0.01em' }}
            >
              More in {product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
