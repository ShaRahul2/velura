import { cache, Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts, getAllProductIds } from '@/lib/products'
import { ProductView } from '@/components/product/ProductView'
import { ProductCard } from '@/components/shop/ProductCard'
import { RecentlyViewed, RecentlyViewedTracker } from '@/components/product/RecentlyViewed'
import { JsonLd } from '@/components/seo/JsonLd'
import { pageWrap } from '@/lib/utils'
import { siteUrl } from '@/lib/site'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { ProductCategory } from '@/types'
import { describeProductImage, describeProductSeo, shotKindFromIndex } from '@/lib/productDescribe'

export const revalidate = 3600

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
    description: describeProductSeo(product),
    openGraph: {
      title: `${product.name} — VELURA`,
      description: describeProductSeo(product),
      images: product.images[0]
        ? [{ url: product.images[0], alt: describeProductImage(product, { shot: 'front' }) }]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  // getCachedProduct is deduplicated — generateMetadata already called it,
  // so this resolves instantly from React's request cache (no second DB query).
  const product = await getCachedProduct(Number(id))
  if (!product) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: describeProductSeo(product),
    image: product.images.map((url, i) => ({
      '@type': 'ImageObject',
      url,
      description: describeProductImage(product, { shot: shotKindFromIndex(i) }),
    })),
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
    <div className="pb-16 md:pb-24">
      <JsonLd data={jsonLd} />
      <RecentlyViewedTracker id={product.id} />
      <ProductView product={product} />

      <div className={`${pageWrap} mt-14 md:mt-20`}>
        <Suspense fallback={<RelatedSkeleton />}>
          <RelatedSection id={product.id} cat={product.cat as ProductCategory} />
        </Suspense>

        <RecentlyViewed currentId={product.id} />
      </div>
    </div>
  )
}

async function RelatedSection({ id, cat }: { id: number; cat: ProductCategory }) {
  const related = await getRelatedProducts(id, cat)
  if (related.length === 0) return null

  return (
    <section>
      <div className="mb-8">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">
          You may also like
        </p>
        <h2
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', letterSpacing: '-0.02em' }}
        >
          More in {cat === 'pushup' ? 'Push-up' : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function RelatedSkeleton() {
  return (
    <div className="mb-16" aria-hidden="true">
      <div className="h-3 w-24 bg-blush mb-3" />
      <div className="h-8 w-48 bg-blush mb-8" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
