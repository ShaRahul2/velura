'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, cn, firstSizeFromRange } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductPhoto } from '@/components/product/ProductPhoto'
import { imagesForColor } from '@/lib/productColorImages'
import { colorLabel } from '@/lib/colorways'
import { describeProductImage } from '@/lib/productDescribe'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const CARD_SIZES = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'

export const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [loadHover, setLoadHover] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)
  const toggle = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted)
  const add = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)
  const wishlisted = isWishlisted(product.id)
  const hasAlt = product.images.length > 1
  const colors = product.colorways ?? []
  const colorImages = imagesForColor(product, colorIndex)
  const selectedColour = colors[colorIndex] ? colorLabel(colors[colorIndex]) : null
  const primaryAlt = describeProductImage(product, { shot: 'front', colorLabel: selectedColour })
  const showAlt = hasAlt && colorIndex === 0 && loadHover

  return (
    <article
      className="group relative flex h-full flex-col"
      onMouseEnter={() => {
        setHovered(true)
        if (hasAlt) setLoadHover(true)
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-blush ring-1 ring-deep/5">
        <Link href={`/shop/${product.id}`} className="absolute inset-0 block">
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-300 ease-out',
              showAlt && hovered ? 'opacity-0' : 'opacity-100'
            )}
          >
            <ProductPhoto
              src={colorImages[0]}
              alt={primaryAlt}
              sizes={CARD_SIZES}
              priority={priority}
            />
          </div>

          {showAlt && (
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-300 ease-out',
                hovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <ProductPhoto src={product.images[1]} alt="" sizes={CARD_SIZES} />
            </div>
          )}
        </Link>

        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge type={product.badge} />
          </div>
        )}

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wishlisted}
          className={cn(
            'absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center transition-opacity duration-150 ease-out',
            wishlisted ? 'bg-deep text-blush' : 'bg-cream/90 text-mauve hover:text-deep',
            !hovered && !wishlisted && 'md:opacity-0 md:group-hover:opacity-100'
          )}
        >
          <Heart size={15} strokeWidth={1.7} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <div className="flex h-8 items-center">
          {colors.length > 0 ? (
            <div className="-ml-1 flex items-center">
              {colors.slice(0, 5).map((hex, i) => {
                const selected = i === colorIndex
                return (
                  <button
                    key={`${hex}-${i}`}
                    type="button"
                    onClick={() => setColorIndex(i)}
                    aria-label={`Show colour ${i + 1}`}
                    aria-pressed={selected}
                    className="flex h-8 w-8 items-center justify-center"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: hex,
                        boxShadow: selected
                          ? '0 0 0 1.5px #0F0D0B, 0 0 0 3px #F8F6F3'
                          : 'inset 0 0 0 1px rgba(15,13,11,0.14)',
                      }}
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            <span className="sr-only">One colourway</span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <Link href={`/shop/${product.id}`} className="min-w-0">
            <h3 className="line-clamp-1 font-serif text-[1.02rem] font-medium leading-tight tracking-[0.01em] text-deep transition-opacity hover:opacity-70">
              {product.name}
            </h3>
          </Link>
          <span className="shrink-0 font-sans text-[1.08rem] tabular-nums text-deep">
            {formatPrice(product.price)}
          </span>
        </div>

        <p className="line-clamp-1 font-sans text-[0.7rem] font-normal italic text-mauve">
          {product.story}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.08em] text-mauve">
            {product.sizes}
          </p>
          {product.oldPrice && (
            <span className="font-sans text-[0.65rem] tabular-nums text-mauve line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            const size = firstSizeFromRange(product.sizes)
            add({
              id: product.id,
              name: product.name,
              price: product.price,
              qty: 1,
              size,
              emoji: product.emoji,
              images: colorImages,
              color: colors[colorIndex],
              colorLabel: selectedColour ?? undefined,
            })
            addToast(`${product.name} (${size}${selectedColour ? ` · ${selectedColour}` : ''}) added to bag`)
            openCart()
          }}
          className="mt-1.5 self-start font-sans text-[0.68rem] uppercase tracking-btn text-deep underline underline-offset-4 hover:opacity-70"
        >
          Add to Bag
        </button>
      </div>
    </article>
  )
})
