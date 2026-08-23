'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductPhoto } from '@/components/product/ProductPhoto'
import { imagesForColor } from '@/lib/productColorImages'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)
  const toggle       = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted)
  const wishlisted   = isWishlisted(product.id)
  const hasAlt = product.images.length > 1
  const colors = product.colorways ?? []
  const colorImages = imagesForColor(product, colorIndex)

  return (
    <article
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/shop/${product.id}`}
        className="block relative aspect-[3/4] rounded-card overflow-hidden bg-blush"
      >
        <div className={cn('absolute inset-0 transition-opacity duration-500', hasAlt && hovered && colorIndex === 0 ? 'opacity-0' : 'opacity-100')}>
          <ProductPhoto
            src={colorImages[0]}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {hasAlt && colorIndex === 0 && (
          <div className={cn('absolute inset-0 transition-opacity duration-500', hovered ? 'opacity-100' : 'opacity-0')}>
            <ProductPhoto
              src={product.images[1]}
              alt=""
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}

        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge type={product.badge} />
          </div>
        )}

        {onQuickView && (
          <span
            className={cn(
              'absolute inset-x-3 bottom-3 z-10 hidden md:flex items-center justify-center h-10 rounded-btn font-sans text-[0.68rem] tracking-btn uppercase bg-cream/95 text-deep transition-opacity duration-200',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onQuickView(product)
            }}
            role="button"
            tabIndex={-1}
          >
            Quick view
          </span>
        )}
      </Link>

      <button
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={cn(
          'absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center transition-all duration-200',
          wishlisted
            ? 'bg-deep text-blush'
            : 'bg-cream/90 text-mauve hover:text-deep',
          !hovered && !wishlisted && 'md:opacity-0 md:group-hover:opacity-100'
        )}
        style={{ borderRadius: 2, backdropFilter: 'blur(6px)' }}
      >
        <Heart size={14} strokeWidth={2} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          {colors.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {colors.slice(0, 4).map((hex, i) => {
                const selected = i === colorIndex
                return (
                  <button
                    key={`${hex}-${i}`}
                    type="button"
                    onClick={() => setColorIndex(i)}
                    aria-label={`Show ${hex} colour`}
                    aria-pressed={selected}
                    className="w-4 h-4 rounded-full cursor-pointer"
                    style={{
                      background: hex,
                      boxShadow: selected
                        ? '0 0 0 1.5px #0F0D0B, 0 0 0 3px #F8F6F3'
                        : 'inset 0 0 0 1px rgba(15,13,11,0.14)',
                    }}
                  />
                )
              })}
            </div>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-sans text-[0.68rem] text-mauve">
              {product.rating}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <Link href={`/shop/${product.id}`} className="min-w-0">
            <h3 className="font-serif text-[1.02rem] font-medium tracking-[0.01em] text-deep leading-tight line-clamp-1 hover:opacity-70 transition-opacity">
              {product.name}
            </h3>
          </Link>
          <div className="sm:text-right shrink-0">
            <span className="font-sans text-[0.95rem] text-deep">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="font-sans text-[0.68rem] text-mauve line-through ml-1.5 sm:ml-0 sm:block">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        <p className="hidden sm:block font-sans text-[0.75rem] italic text-mauve leading-snug line-clamp-1">
          {product.story}
        </p>

        <p className="font-sans text-[0.62rem] tracking-[0.08em] uppercase text-mauve">
          {product.sizes}
        </p>
      </div>
    </article>
  )
}
