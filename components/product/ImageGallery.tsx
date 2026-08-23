'use client'

import { useEffect, useState } from 'react'
import { ProductPhoto } from './ProductPhoto'

interface ImageGalleryProps {
  images: string[]
  name: string
}

const LABELS = ['Front', 'Back', 'Lifestyle']

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const signature = images.join('|')

  useEffect(() => {
    setActive(0)
  }, [signature])

  const safeIndex = images[active] ? active : 0

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className="shrink-0 w-16 h-20 lg:w-[68px] lg:h-[85px] relative rounded-card overflow-hidden border-[1.5px] bg-blush"
              style={{ borderColor: safeIndex === i ? '#0F0D0B' : 'transparent' }}
              aria-label={`View ${LABELS[i] ?? `image ${i + 1}`}`}
            >
              <ProductPhoto src={src} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 relative aspect-[3/4] rounded-card overflow-hidden bg-blush">
        <ProductPhoto
          src={images[safeIndex] ?? images[0]}
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}
