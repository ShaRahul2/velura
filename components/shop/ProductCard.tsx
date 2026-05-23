'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { Star } from 'lucide-react'

/* Per-category visual treatment */
const CAT_STYLE: Record<string, { bg: string; isDark: boolean; pattern: string }> = {
  everyday: {
    bg: 'linear-gradient(145deg, #F4F0EC 0%, #E5DED6 100%)',
    isDark: false,
    pattern: 'radial-gradient(circle at 70% 30%, rgba(184,168,152,0.18) 0%, transparent 60%)',
  },
  pushup: {
    bg: 'linear-gradient(145deg, #1E1916 0%, #2E2420 100%)',
    isDark: true,
    pattern: 'radial-gradient(circle at 30% 70%, rgba(184,168,152,0.12) 0%, transparent 55%)',
  },
  lace: {
    bg: 'linear-gradient(145deg, #FAF6F0 0%, #EFE8DF 100%)',
    isDark: false,
    pattern: 'radial-gradient(circle at 65% 35%, rgba(154,136,120,0.15) 0%, transparent 55%)',
  },
  sports: {
    bg: 'linear-gradient(145deg, #252018 0%, #1A1710 100%)',
    isDark: true,
    pattern: 'linear-gradient(135deg, rgba(216,212,206,0.06) 25%, transparent 25%, transparent 75%, rgba(216,212,206,0.06) 75%)',
  },
  seamless: {
    bg: 'linear-gradient(145deg, #EDE9E4 0%, #DDD8D0 100%)',
    isDark: false,
    pattern: 'radial-gradient(ellipse at 50% 60%, rgba(184,168,152,0.2) 0%, transparent 65%)',
  },
  plus: {
    bg: 'linear-gradient(145deg, #F2EBE3 0%, #E2D8CC 100%)',
    isDark: false,
    pattern: 'radial-gradient(circle at 40% 40%, rgba(184,168,152,0.18) 0%, transparent 60%)',
  },
  bridal: {
    bg: 'linear-gradient(145deg, #FEFCFA 0%, #F5EEE5 100%)',
    isDark: false,
    pattern: 'radial-gradient(circle at 60% 40%, rgba(196,184,168,0.22) 0%, transparent 58%)',
  },
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const add      = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

  const style   = CAT_STYLE[product.cat] ?? CAT_STYLE.everyday
  const isDark  = style.isDark

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    add({ id: product.id, name: product.name, price: product.price, qty: 1, size: 'M', emoji: product.emoji, images: product.images })
    addToast(`${product.name} added to bag`)
    openCart()
  }

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

          {/* Quick-add on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleQuickAdd}
              className="w-full font-sans text-[0.72rem] tracking-btn uppercase py-3 transition-all duration-200 hover:tracking-wide bg-cream/90 text-deep backdrop-blur-sm"
            >
              Add to Bag
            </button>
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
