import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductPhotoProps {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

export function ProductPhoto({ src, alt, sizes, priority, className }: ProductPhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
    />
  )
}
