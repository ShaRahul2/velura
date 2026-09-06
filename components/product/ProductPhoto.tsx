import Image from 'next/image'
import { cn } from '@/lib/utils'
import { shouldBypassImageOptimizer } from '@/lib/imageOptimizer'

interface ProductPhotoProps {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
  quality?: number
  blurDataURL?: string
}

export function ProductPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  quality = 70,
  blurDataURL,
}: ProductPhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      unoptimized={shouldBypassImageOptimizer(src)}
      className={cn('object-cover', className)}
    />
  )
}
