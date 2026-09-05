import { requireAdmin } from '@/lib/adminSession'
import { notFound } from 'next/navigation'
import { mapDbProductToProduct } from '@/lib/products'
import { db } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'
import { EditImagePanel } from './EditImagePanel'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const productId = Number(id)
  if (!Number.isSafeInteger(productId) || productId < 1) notFound()

  const [product, images] = await Promise.all([
    db.product.findUnique({ where: { id: productId }, include: { category: true, images: { orderBy: { position: 'asc' } } } }),
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
        Product #{product.id} · {product.category.label}
      </p>

      {/* Product fields */}
      <section className="mb-10">
        <h2 className="text-[0.65rem] tracking-[0.14em] text-[#B8A898] uppercase mb-4">
          Details
        </h2>
        <ProductForm product={mapDbProductToProduct(product)} />
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
