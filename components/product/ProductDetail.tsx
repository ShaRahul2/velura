'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SizeSelector } from './SizeSelector'
import { Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUiStore } from '@/store/uiStore'
import { colorLabel } from '@/lib/colorways'
import { imagesForColor } from '@/lib/productColorImages'
import { parseSizeRange } from '@/lib/sizes'
import { ProductMeta } from './ProductMeta'

interface ProductDetailProps {
  product: Product
  colorIndex?: number
  onColorChange?: (index: number) => void
}

export function ProductDetail({ product, colorIndex = 0, onColorChange }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [error, setError] = useState(false)
  const add      = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)
  const toggleSaved = useWishlistStore((s) => s.toggle)
  const isSaved = useWishlistStore((s) => s.isWishlisted(product.id))

  const availableSizes = parseSizeRange(product.sizes)
  const [guideOpen, setGuideOpen] = useState(false)
  const colors = product.colorways ?? []
  const selectedHex = colors[colorIndex]
  const selectedLabel = selectedHex ? colorLabel(selectedHex) : null

  function handleAddToBag() {
    if (!selectedSize) {
      setError(true)
      return
    }
    setError(false)
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      size: selectedSize,
      emoji: product.emoji,
      images: imagesForColor(product, colorIndex),
      color: selectedHex,
      colorLabel: selectedLabel ?? undefined,
    })
    addToast(
      `${product.name} (${selectedSize}${selectedLabel ? ` · ${selectedLabel}` : ''}) added to bag`
    )
    openCart()
  }

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-0">
      <div>
        {product.badge && (
          <div className="mb-3">
            <Badge type={product.badge} />
          </div>
        )}
        <h1
          className="font-serif font-light text-deep leading-tight"
          style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)', letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h1>
        <p className="mt-2 font-sans text-[0.88rem] font-light italic leading-relaxed text-mauve">
          {product.story}
        </p>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-[1.15rem] text-deep">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="font-sans text-[0.88rem] text-mauve line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="font-sans text-[0.72rem] text-mauve">
          {product.rating} · {product.reviews.toLocaleString('en-IN')} reviews
        </p>
      </div>

      {colors.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">
              Colour
            </p>
            {selectedLabel && (
              <p className="font-sans text-[0.78rem] font-medium text-deep">{selectedLabel}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((hex, i) => {
              const selected = i === colorIndex
              return (
                <button
                  key={`${hex}-${i}`}
                  type="button"
                  onClick={() => onColorChange?.(i)}
                  aria-label={colorLabel(hex)}
                  aria-pressed={selected}
                  className="w-7 h-7 rounded-full cursor-pointer transition-transform"
                  style={{
                    background: hex,
                    boxShadow: selected
                      ? '0 0 0 1.5px #0F0D0B, 0 0 0 3px #F8F6F3'
                      : 'inset 0 0 0 1px rgba(15,13,11,0.16)',
                    transform: selected ? 'scale(1.06)' : 'scale(1)',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            Size{selectedSize ? ` · ${selectedSize}` : ''}
          </p>
          <button
            type="button"
            onClick={() => setGuideOpen((v) => !v)}
            className="font-sans text-[0.72rem] text-mauve underline underline-offset-4 hover:text-deep"
          >
            {guideOpen ? 'Close' : 'Size guide'}
          </button>
        </div>
        {guideOpen && (
          <p className="font-sans text-[0.8rem] font-light text-mauve leading-relaxed mb-3">
            Band from underbust, rounded up to the even inch. Cup from the difference to the fullest point.
            This piece: {product.sizes}. Unsure —{' '}
            <Link href="/size-guide" className="text-deep underline underline-offset-4">
              read the full guide
            </Link>
            , or ask the atelier.
          </p>
        )}
        <SizeSelector
          available={availableSizes}
          selected={selectedSize}
          onSelect={(s) => { setSelectedSize(s); setError(false) }}
        />
        {error && (
          <p role="alert" className="font-sans text-[0.72rem] text-mauve mt-2">
            Please select a size to continue.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="dark" size="lg" onClick={handleAddToBag} className="hidden w-full md:inline-flex">
          Add to Bag
        </Button>
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="hidden h-12 w-12 shrink-0 items-center justify-center border border-deep text-deep md:inline-flex"
        >
          <Heart size={16} strokeWidth={1.7} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {[
          'Free shipping above ₹999',
          '15-day easy returns',
          `${product.fabric} · ${product.support} support`,
        ].map((line) => (
          <li key={line} className="flex gap-2 font-sans text-[0.74rem] text-mauve">
            <span className="text-rose">✦</span>
            {line}
          </li>
        ))}
      </ul>

      <ProductMeta product={product} />

      <div
        className="fixed inset-x-0 bottom-0 z-30 md:hidden border-t border-lm bg-cream/95 backdrop-blur-xl px-4 py-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="font-sans text-[0.92rem] text-deep tabular-nums leading-none">
              {formatPrice(product.price)}
            </p>
            <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mt-1 truncate">
              {selectedSize ? selectedSize : 'Select a size'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(product.id)}
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-deep text-deep"
          >
            <Heart size={16} strokeWidth={1.7} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
          <Button variant="dark" size="lg" onClick={handleAddToBag} className="flex-1">
            Add to Bag
          </Button>
        </div>
      </div>
    </div>
  )
}
