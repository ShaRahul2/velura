'use client'

import { useState, useCallback } from 'react'
import { ImageManager } from '@/components/admin/ImageManager'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'

interface AdminImage {
  id:        number
  url:       string
  key:       string | null
  alt:       string | null
  position:  number
  type:      string
  isPrimary: boolean
}

interface Props {
  productId:     number
  initialImages: AdminImage[]
}

export function EditImagePanel({ productId, initialImages }: Props) {
  const [images, setImages] = useState<AdminImage[]>(initialImages)

  const refresh = useCallback(async () => {
    const res  = await fetch(`/api/products/${productId}/images`)
    const json = await res.json() as { data: AdminImage[] }
    setImages(json.data)
  }, [productId])

  return (
    <div className="space-y-6">
      <ImageManager productId={productId} images={images} onRefresh={refresh} />
      <div className="border-t border-[rgba(184,168,152,0.1)] pt-6">
        <p className="text-[0.65rem] tracking-[0.12em] text-[rgba(237,233,228,0.35)] uppercase mb-3">
          Upload Image
        </p>
        <ProductImageUploader productId={productId} onUploaded={refresh} />
      </div>
    </div>
  )
}
