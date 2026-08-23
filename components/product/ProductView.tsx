'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { ImageGallery } from './ImageGallery'
import { ProductDetail } from './ProductDetail'
import { imagesForColor } from '@/lib/productColorImages'

export function ProductView({ product }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0)
  const images = imagesForColor(product, colorIndex)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 xl:gap-20 items-start">
      <div>
        <ImageGallery
          key={`${product.id}-${colorIndex}`}
          images={images}
          name={product.name}
        />
      </div>
      <div className="px-5 md:px-8 lg:px-0 py-8 lg:py-4 lg:pr-8 lg:sticky lg:top-24 self-start">
        <ProductDetail
          product={product}
          colorIndex={colorIndex}
          onColorChange={setColorIndex}
        />
      </div>
    </div>
  )
}
