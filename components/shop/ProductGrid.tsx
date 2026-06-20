import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  cols?: 2 | 3 | 4 | 5
}

export function ProductGrid({ products, loading = false, cols = 3 }: ProductGridProps) {
  const gridClass =
    cols === 2
      ? 'grid-cols-2'
      : cols === 3
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5'
        : cols === 4
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 xl:gap-x-9 2xl:gap-x-10`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="font-serif text-[1.5rem] lg:text-[1.7rem] font-light text-deep">
          Nothing here yet.
        </p>
        <p className="font-sans text-[0.85rem] lg:text-[0.92rem] text-mauve">
          Try a different filter.
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 xl:gap-x-9`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
