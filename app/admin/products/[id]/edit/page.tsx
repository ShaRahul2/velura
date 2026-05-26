import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import { db } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'
import { EditImagePanel } from './EditImagePanel'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productId = parseInt(id, 10)

  const [product, images] = await Promise.all([
    getProductById(productId),
    db.productImage.findMany({
      where:   { productId },
      orderBy: { position: 'asc' },
    }),
  ])

  if (!product) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-[1.4rem] font-serif font-light text-[#EDE9E4] tracking-[-0.01em] mb-2">
        {product.name}
      </h1>
      <p className="text-[0.72rem] text-[rgba(237,233,228,0.3)] mb-8">
        Product #{product.id} · {product.cat}
      </p>

      {/* Product fields */}
      <section className="mb-10">
        <h2 className="text-[0.65rem] tracking-[0.14em] text-[#B8A898] uppercase mb-4">
          Details
        </h2>
        <ProductForm product={product} />
      </section>

      {/* Image management */}
      <section>
        <h2 className="text-[0.65rem] tracking-[0.14em] text-[#B8A898] uppercase mb-4">
          Images
        </h2>
        <EditImagePanel productId={productId} initialImages={images} />
      </section>
    </div>
  )
}
