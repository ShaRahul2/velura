'use client'

import { useState } from 'react'
import { ProductPhoto } from './ProductPhoto'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  name: string
}

const LABELS = ['Front', 'Back', 'Lifestyle']

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const safeIndex = images[active] ? active : 0

  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-blush md:flex-1 md:order-2">
        <ProductPhoto
          src={images[safeIndex] ?? images[0]}
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible px-5 md:px-0 pb-1 md:pb-0 md:order-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'shrink-0 w-16 h-20 lg:w-[72px] lg:h-[90px] relative overflow-hidden bg-blush border-[1.5px]',
                safeIndex === i ? 'border-deep' : 'border-transparent'
              )}
              aria-label={`View ${LABELS[i] ?? `image ${i + 1}`}`}
            >
              <ProductPhoto src={src} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
