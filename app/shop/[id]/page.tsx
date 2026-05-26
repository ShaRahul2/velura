import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts, getAllProductIds } from '@/lib/products'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetail } from '@/components/product/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'
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
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      {/* Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-20">
        <ImageGallery images={product.images} name={product.name} />
        <ProductDetail product={product} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <div className="mb-8">
            <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">
              You may also like
            </p>
            <h2
              className="font-serif font-light text-deep"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.01em' }}
            >
              More in {product.cat}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
