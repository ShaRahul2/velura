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
    <div className="contents">
      <ImageGallery
        key={`${product.id}-${colorIndex}`}
        images={images}
        name={product.name}
      />
      <ProductDetail
        product={product}
        colorIndex={colorIndex}
        onColorChange={setColorIndex}
      />
    </div>
  )
}
