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
}

export function ProductPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  quality = 75,
}: ProductPhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={shouldBypassImageOptimizer(src)}
      className={cn('object-cover', className)}
    />
  )
}
