'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  name: string
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)

  const labels = ['Front', 'Back', 'Lifestyle']

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="shrink-0 w-16 h-20 lg:w-[68px] lg:h-[85px] rounded-card overflow-hidden border-[1.5px] transition-all relative bg-blush"
            style={{ borderColor: active === i ? '#0F0D0B' : 'transparent' }}
            aria-label={`View ${labels[i] ?? `image ${i + 1}`}`}
          >
            <Image
              src={src}
              alt={`${name} — ${labels[i] ?? `view ${i + 1}`}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative aspect-[3/4] rounded-card overflow-hidden bg-blush">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>
    </div>
  )
}
