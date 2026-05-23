import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetail } from '@/components/product/ProductDetail'
import { ProductCard } from '@/components/shop/ProductCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))
  if (!product) return {}
  return {
    title: `${product.name} — VELURA`,
    description: product.story,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))
  if (!product) notFound()

  const related = products
    .filter((p) => p.cat === product.cat && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      {/* Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-20">
        <ImageGallery emoji={product.emoji} name={product.name} />
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
