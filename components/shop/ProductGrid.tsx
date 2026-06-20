import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  cols?: 2 | 3
}

export function ProductGrid({ products, loading = false, cols = 3 }: ProductGridProps) {
  const gridClass = cols === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="font-serif text-[1.5rem] font-light text-deep">
          Nothing here yet.
        </p>
        <p className="font-sans text-[0.85rem] text-mauve">
          Try a different filter.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
