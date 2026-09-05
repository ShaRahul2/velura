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

function Thumb({
  src,
  active,
  label,
  onSelect,
  className,
}: {
  src: string
  active: boolean
  label: string
  onSelect: () => void
  className: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative overflow-hidden bg-blush',
        active ? 'ring-1 ring-deep' : 'ring-1 ring-lm',
        className,
      )}
      aria-label={label}
      aria-current={active}
    >
      <ProductPhoto src={src} alt="" sizes="64px" />
    </button>
  )
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

  const thumbs = shots.map((src, i) => ({
    src,
    label: `View ${describeProductShort(product, { shot: shotKindFromIndex(i), colorLabel })}`,
    i,
  }))

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[3.75rem_minmax(0,1fr)] lg:items-start lg:gap-3">
        <div className="hidden lg:flex lg:flex-col lg:gap-2">
          {thumbs.map(({ src, label, i }) => (
            <Thumb
              key={`${src}-${i}`}
              src={src}
              active={safeIndex === i}
              label={label}
              onSelect={() => setActive(i)}
              className="aspect-[3/4] w-full"
            />
          ))}
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush lg:aspect-auto lg:h-[calc(100svh-4rem)]">
          <ProductPhoto
            src={shots[safeIndex]}
            alt={activeAlt}
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </div>
      </div>

      {shots.length > 1 && (
        <div className="mt-3 flex gap-1.5 px-5 md:px-8 lg:hidden">
          {thumbs.map(({ src, label, i }) => (
            <Thumb
              key={`${src}-${i}`}
              src={src}
              active={safeIndex === i}
              label={label}
              onSelect={() => setActive(i)}
              className="h-16 w-12 shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  )
}
