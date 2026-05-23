'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SizeSelector } from './SizeSelector'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'

function parseSizes(range: string): string[] {
  const bands = [28,30,32,34,36,38,40,42,44]
  const cups  = ['AA','A','B','C','D','DD','DDD','G']
  const sizes: string[] = []
  const [startStr, endStr] = range.split('–')
  const startBand = parseInt(startStr)
  const startCup  = startStr.replace(String(startBand), '')
  const endBand   = parseInt(endStr)
  const endCup    = endStr.replace(String(endBand), '')

  let active = false
  for (const band of bands) {
    for (const cup of cups) {
      const key = `${band}${cup}`
      if (`${startBand}${startCup}` === key) active = true
      if (active) sizes.push(key)
      if (`${endBand}${endCup}` === key) return sizes
    }
  }
  return sizes
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [error, setError] = useState(false)
  const add      = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

  const availableSizes = parseSizes(product.sizes)

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
      images: product.images,
    })
    addToast(`${product.name} (${selectedSize}) added to bag`)
    openCart()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Badge + Name */}
      <div className="flex flex-col gap-3">
        {product.badge && <Badge type={product.badge} />}
        <h1
          className="font-serif font-light text-deep leading-tight"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h1>
        <p className="font-sans text-[0.82rem] italic text-mauve">{product.story}</p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-sans text-[1.3rem] text-deep">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="font-sans text-[0.9rem] text-mauve line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-lm'}
            />
          ))}
        </div>
        <span className="font-sans text-[0.75rem] text-mauve">
          {product.rating} · {product.reviews.toLocaleString('en-IN')} reviews
        </span>
      </div>

      {/* Sub info */}
      <p className="font-sans text-[0.8rem] text-mauve">{product.sub}</p>

      <div className="h-px bg-lm" />

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-[0.72rem] tracking-label uppercase text-mauve">Size</p>
          {selectedSize && (
            <p className="font-sans text-[0.78rem] font-medium text-deep">{selectedSize}</p>
          )}
        </div>
        <SizeSelector
          available={availableSizes}
          selected={selectedSize}
          onSelect={(s) => { setSelectedSize(s); setError(false) }}
        />
        {error && (
          <p className="font-sans text-[0.72rem] text-mauve mt-2">
            Please select a size to continue.
          </p>
        )}
      </div>

      {/* CTA */}
      <Button variant="dark" size="lg" onClick={handleAddToBag} className="w-full">
        Add to Bag
      </Button>

      {/* Fabric + Support */}
      <div className="flex gap-6 pt-2">
        <div>
          <p className="font-sans text-[0.65rem] tracking-label uppercase text-rose mb-1">Fabric</p>
          <p className="font-sans text-[0.82rem] text-deep">{product.fabric}</p>
        </div>
        <div>
          <p className="font-sans text-[0.65rem] tracking-label uppercase text-rose mb-1">Support</p>
          <p className="font-sans text-[0.82rem] text-deep">{product.support}</p>
        </div>
      </div>
    </div>
  )
}
