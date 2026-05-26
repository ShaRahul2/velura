import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-[1.4rem] font-serif font-light text-[#EDE9E4] tracking-[-0.01em] mb-8">
        New Product
      </h1>
      <ProductForm />
    </div>
  )
}
