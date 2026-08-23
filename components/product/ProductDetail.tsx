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
import { colorLabel } from '@/lib/colorways'
import { imagesForColor } from '@/lib/productColorImages'

function parseSizes(range: string): string[] {
  const bands = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50]
  const cups  = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H']
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
  colorIndex?: number
  onColorChange?: (index: number) => void
}

export function ProductDetail({ product, colorIndex = 0, onColorChange }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [error, setError] = useState(false)
  const add      = useCartStore((s) => s.add)
  const openCart = useUiStore((s) => s.openCart)
  const addToast = useUiStore((s) => s.addToast)

  const availableSizes = parseSizes(product.sizes)
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
    <div className="flex flex-col gap-6 lg:sticky lg:top-28">
      <div className="flex flex-col items-start gap-3">
        {product.badge && <Badge type={product.badge} />}
        <h1
          className="font-serif font-light text-deep leading-tight"
          style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.6rem)', letterSpacing: '-0.01em' }}
        >
          {product.name}
        </h1>
        <p className="font-sans text-[0.88rem] italic text-mauve">{product.story}</p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-sans text-[1.25rem] text-deep">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="font-sans text-[0.92rem] text-mauve line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {product.oldPrice && (
          <span className="font-sans text-[0.68rem] tracking-label uppercase text-gold">
            Sale
          </span>
        )}
      </div>

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
        <span className="font-sans text-[0.78rem] text-mauve">
          {product.rating} · {product.reviews.toLocaleString('en-IN')} reviews
        </span>
      </div>

      <p className="font-sans text-[0.84rem] text-mauve">{product.sub}</p>

      <div className="h-px bg-lm" />

      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans text-[0.72rem] tracking-label uppercase text-mauve">
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

      <Button variant="dark" size="lg" onClick={handleAddToBag} className="w-full">
        Add to Bag
      </Button>

      <ul className="flex flex-col gap-2 pt-1">
        {[
          'Free shipping above ₹999',
          '15-day easy returns',
          `${product.fabric} · ${product.support} support`,
        ].map((line) => (
          <li key={line} className="font-sans text-[0.78rem] text-mauve flex gap-2">
            <span style={{ color: '#B8A898' }}>✦</span>
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
