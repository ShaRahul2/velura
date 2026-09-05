'use client'

import { useEffect, useState } from 'react'
import { ProductPhoto } from './ProductPhoto'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { describeProductImage, describeProductShort, shotKindFromIndex } from '@/lib/productDescribe'

interface ImageGalleryProps {
  images: string[]
  product: Product
  colorLabel?: string | null
}

export function ImageGallery({ images, product, colorLabel }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const shots = images.filter(Boolean)
  const safeIndex = shots[active] ? active : 0

  useEffect(() => {
    setActive(0)
  }, [shots[0]])

  if (shots.length === 0) {
    return <div className="aspect-[3/4] bg-blush" />
  }

  const activeAlt = describeProductImage(product, {
    shot: shotKindFromIndex(safeIndex),
    colorLabel,
  })

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush lg:max-h-[calc(100svh-5.5rem)]">
      <ProductPhoto
        src={shots[safeIndex]}
        alt={activeAlt}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />

      {shots.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-1.5 md:bottom-4 md:left-4">
          {shots.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative h-14 w-11 overflow-hidden bg-blush shadow-[0_1px_8px_rgba(15,13,11,0.18)] md:h-16 md:w-12',
                safeIndex === i ? 'ring-1 ring-deep ring-offset-1 ring-offset-blush' : 'ring-1 ring-white/40',
              )}
              aria-label={`View ${describeProductShort(product, { shot: shotKindFromIndex(i), colorLabel })}`}
              aria-current={safeIndex === i}
            >
              <ProductPhoto src={src} alt="" sizes="48px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
