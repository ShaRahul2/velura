import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts, getAllProductIds } from '@/lib/products'
import { ProductView } from '@/components/product/ProductView'
import { ProductCard } from '@/components/shop/ProductCard'
import { RecentlyViewed, RecentlyViewedTracker } from '@/components/product/RecentlyViewed'
import { JsonLd } from '@/components/seo/JsonLd'
import { pageWrap } from '@/lib/utils'
import { siteUrl } from '@/lib/site'
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
    title: product.name,
    description: product.story,
    openGraph: {
      title: `${product.name} — VELURA`,
      description: product.story,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  // getCachedProduct is deduplicated — generateMetadata already called it,
  // so this resolves instantly from React's request cache (no second DB query).
  const product = await getCachedProduct(Number(id))
  if (!product) notFound()

  const related = await getRelatedProducts(product.id, product.cat as ProductCategory)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.story,
    image: product.images,
    brand: { '@type': 'Brand', name: 'VELURA' },
    sku: String(product.id),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl()}/shop/${product.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  }

  return (
    <div className="pt-2 lg:pt-8 pb-16 md:pb-24">
      <JsonLd data={jsonLd} />
      <RecentlyViewedTracker id={product.id} />
      <ProductView product={product} />

      <div className={`${pageWrap} mt-16 md:mt-24`}>
        {related.length > 0 && (
          <section>
            <div className="mb-8">
              <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">
                You may also like
              </p>
              <h2
                className="font-serif font-light text-deep"
                style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', letterSpacing: '-0.02em' }}
              >
                More in {product.cat.charAt(0).toUpperCase() + product.cat.slice(1)}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <RecentlyViewed currentId={product.id} />
      </div>
    </div>
  )
}
