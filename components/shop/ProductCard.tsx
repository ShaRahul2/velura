'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useWishlistStore } from '@/store/wishlistStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const toggle       = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted)
  const wishlisted   = isWishlisted(product.id)

  const hasAlt = product.images.length > 1

  return (
    <article
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <Link
        href={`/shop/${product.id}`}
        className="block relative aspect-[3/4] rounded-card overflow-hidden bg-blush shadow-card"
        tabIndex={0}
      >
        {/* Primary image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            'object-cover transition-all duration-500 group-hover:scale-[1.02]',
            hasAlt && hovered ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* Secondary image — crossfades in on hover */}
        {hasAlt && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — back view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-all duration-500 group-hover:scale-[1.02]',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Bottom gradient — keeps fabric label legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.42) 0%, transparent 46%)' }}
        />

        {/* Badge — top left */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge type={product.badge} />
          </div>
        )}

        {/* Fabric label — bottom left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className="font-sans text-[0.58rem] lg:text-[0.64rem] tracking-label uppercase px-2 py-1"
            style={{
              borderRadius: 2,
              background:   'rgba(248,246,243,0.88)',
              color:        '#6B6058',
              backdropFilter: 'blur(4px)',
            }}
          >
            {product.fabric}
          </span>
        </div>

        {/* Hover CTA — fades in at bottom */}
        <div
          className="absolute bottom-0 inset-x-0 pb-3 pt-6 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <p className="text-center font-sans text-[0.62rem] lg:text-[0.68rem] tracking-[0.2em] uppercase text-[rgba(237,233,228,0.85)]">
            View Details ↗
          </p>
        </div>
      </Link>

      {/* ── Wishlist — absolutely positioned over image, outside Link ─────── */}
      <button
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={cn(
          'absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center transition-all duration-200',
          'rounded-full',
          wishlisted
            ? 'bg-deep text-blush'
            : 'bg-[rgba(248,246,243,0.82)] text-mauve hover:bg-[rgba(248,246,243,1)] hover:text-deep',
          !hovered && !wishlisted && 'opacity-0 group-hover:opacity-100'
        )}
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <Heart
          size={12}
          strokeWidth={2}
          fill={wishlisted ? 'currentColor' : 'none'}
        />
      </button>

      {/* ── Info ──────────────────────────────────────────────────────────── */}
      <div className="mt-3 lg:mt-4 xl:mt-5 px-0.5 flex flex-col gap-1.5 lg:gap-2">

        {/* Color swatches + rating row */}
        <div className="flex items-center justify-between">
          {product.colorways && product.colorways.length > 0 ? (
            <div className="flex items-center gap-1.5 lg:gap-2">
              {product.colorways.slice(0, 4).map((hex, i) => (
                <span
                  key={i}
                  className="inline-block w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-[18px] 2xl:h-[18px] rounded-full flex-shrink-0"
                  style={{
                    background:  hex,
                    boxShadow:   'inset 0 0 0 1px rgba(15,13,11,0.12)',
                  }}
                  title={hex}
                />
              ))}
              {product.colorways.length > 4 && (
                <span className="font-sans text-[0.58rem] lg:text-[0.64rem] text-mauve opacity-70">
                  +{product.colorways.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span />
          )}

          {/* Star rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3 lg:w-3.5 2xl:w-4 h-3 lg:h-3.5 2xl:h-4 fill-gold text-gold" />
            <span className="font-sans text-[0.66rem] lg:text-[0.72rem] text-mauve">
              {product.rating}
              <span className="opacity-50 ml-0.5">({product.reviews.toLocaleString('en-IN')})</span>
            </span>
          </div>
        </div>

        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/shop/${product.id}`} className="flex-1 min-w-0">
            <h3 className="font-serif text-[clamp(0.95rem,0.95vw,1.2rem)] font-[500] tracking-[0.01em] text-deep leading-tight line-clamp-1 hover:opacity-70 transition-opacity">
              {product.name}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <span className="font-sans text-[clamp(0.95rem,0.95vw,1.2rem)] font-normal text-deep leading-none">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <p className="font-sans text-[0.68rem] lg:text-[0.74rem] text-mauve line-through leading-tight mt-0.5">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Story */}
        <p className="font-sans text-[clamp(0.68rem,0.7vw,0.82rem)] italic text-mauve leading-snug line-clamp-1">
          {product.story}
        </p>

        {/* Sizes range pill */}
        <div>
          <span
            className="font-sans text-[0.58rem] lg:text-[0.62rem] tracking-[0.08em] uppercase text-mauve px-2 py-[3px] inline-block"
            style={{
              borderRadius: 2,
              border:       '1px solid #D8D4CE',
              background:   'rgba(15,13,11,0.02)',
            }}
          >
            {product.sizes}
          </span>
        </div>
      </div>
    </article>
  )
}
