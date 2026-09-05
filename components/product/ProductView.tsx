'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { ImageGallery } from './ImageGallery'
import { ProductDetail } from './ProductDetail'
import { imagesForColor } from '@/lib/productColorImages'
import { colorLabel } from '@/lib/colorways'
import { pageWrap } from '@/lib/utils'

export function ProductView({ product }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0)
  const images = imagesForColor(product, colorIndex)
  const hex = product.colorways?.[colorIndex]
  const colour = hex ? colorLabel(hex) : null

  return (
    <div className={`${pageWrap} grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:gap-14 xl:gap-20`}>
      <div className="-mx-5 md:-mx-8 lg:mx-0">
        <ImageGallery
          images={images}
          product={product}
          colorLabel={colour}
        />
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start lg:py-1">
        <ProductDetail
          product={product}
          colorIndex={colorIndex}
          onColorChange={setColorIndex}
        />
      </div>
    </div>
  )
}
