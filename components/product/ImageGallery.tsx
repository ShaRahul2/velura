'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  emoji: string
  name: string
}

const GRADIENT_VARIANTS = [
  'linear-gradient(135deg, #EDE9E4 0%, #D8D4CE 100%)',
  'linear-gradient(160deg, #D8D4CE 0%, #C8C0B8 100%)',
  'linear-gradient(120deg, #F8F6F3 0%, #EDE9E4 100%)',
]

export function ImageGallery({ emoji, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {GRADIENT_VARIANTS.map((grad, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="shrink-0 w-16 h-20 rounded-card overflow-hidden border-[1.5px] transition-all"
            style={{
              background: grad,
              borderColor: active === i ? '#0F0D0B' : 'transparent',
            }}
            aria-label={`View image ${i + 1}`}
          >
            <span className="flex items-center justify-center h-full text-xl" aria-hidden="true">
              {emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="flex-1 aspect-[3/4] rounded-card overflow-hidden flex items-center justify-center"
        style={{ background: GRADIENT_VARIANTS[active] }}
      >
        <span
          className="text-8xl"
          style={{ animation: 'float 5s ease-in-out infinite' }}
          role="img"
          aria-label={name}
        >
          {emoji}
        </span>
      </div>
    </div>
  )
}
