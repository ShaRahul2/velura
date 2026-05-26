'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <article className="flex flex-col gap-3">

        {/* ── Image area ── */}
        <div className="relative aspect-[3/4] rounded-card overflow-hidden shadow-card bg-blush">
          {/* Real photo */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* Subtle gradient overlay at bottom for legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.45) 0%, transparent 45%)' }}
          />

          {/* Fabric label */}
          <div className="absolute bottom-3 left-3">
            <span
              className="font-sans text-[0.6rem] tracking-label uppercase px-2 py-1 rounded-[2px]"
              style={{ background: 'rgba(248,246,243,0.85)', color: '#6B6058', backdropFilter: 'blur(4px)' }}
            >
              {product.fabric}
            </span>
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge type={product.badge} />
            </div>
          )}

          {/* Quick-view on hover — navigates to product detail where user picks a real size */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <div className="w-full font-sans text-[0.72rem] tracking-btn uppercase py-3 text-center bg-cream/90 text-deep backdrop-blur-sm pointer-events-none">
              View Product
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-1 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-[1.02rem] font-[500] tracking-[0.01em] text-deep leading-tight">
              {product.name}
            </h3>
            <div className="text-right shrink-0">
              <span className="font-sans text-[1rem] font-normal text-deep">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <p className="font-sans text-[0.7rem] text-mauve line-through">
                  {formatPrice(product.oldPrice)}
                </p>
              )}
            </div>
          </div>

          <p className="font-sans text-[0.7rem] italic text-mauve leading-snug line-clamp-1">
            {product.story}
          </p>

          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-[0.68rem] font-sans text-mauve">
              {product.rating} <span className="opacity-60">({product.reviews.toLocaleString('en-IN')})</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
