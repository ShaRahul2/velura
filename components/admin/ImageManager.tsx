'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Trash2 } from 'lucide-react'

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
  productId: number
  images:    AdminImage[]
  onRefresh: () => void
}

export function ImageManager({ productId, images, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  async function setPrimary(imageId: number) {
    setLoadingId(imageId)
    await fetch(`/api/products/${productId}/images/${imageId}/primary`, { method: 'PATCH' })
    onRefresh()
    setLoadingId(null)
  }

  async function deleteImage(imageId: number) {
    if (!confirm('Delete this image? This cannot be undone.')) return
    setLoadingId(imageId)
    await fetch(`/api/products/${productId}/images/${imageId}`, { method: 'DELETE' })
    onRefresh()
    setLoadingId(null)
  }

  if (images.length === 0) {
    return (
      <p className="text-[0.78rem] text-[rgba(237,233,228,0.3)] italic">
        No images yet — upload one below.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          className={[
            'relative group rounded-[3px] overflow-hidden bg-[rgba(237,233,228,0.04)] border transition-colors',
            img.isPrimary
              ? 'border-[rgba(184,168,152,0.6)]'
              : 'border-[rgba(184,168,152,0.12)] hover:border-[rgba(184,168,152,0.25)]',
          ].join(' ')}
        >
          {/* Image */}
          <div className="aspect-[4/5] relative">
            <Image
              src={img.url}
              alt={img.alt ?? ''}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>

          {/* Primary badge */}
          {img.isPrimary && (
            <div className="absolute top-1.5 left-1.5 bg-[rgba(15,13,11,0.75)] rounded-[2px] px-1.5 py-0.5 flex items-center gap-1">
              <Star size={9} fill="#B8A898" stroke="none" />
              <span className="text-[0.55rem] text-[#B8A898] tracking-[0.1em] uppercase">Primary</span>
            </div>
          )}

          {/* Type label */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(15,13,11,0.7)] to-transparent px-2 py-1.5">
            <span className="text-[0.55rem] text-[rgba(237,233,228,0.6)] tracking-[0.1em] uppercase">
              {img.type}
            </span>
          </div>

          {/* Actions — appear on hover */}
          <div className="absolute inset-0 bg-[rgba(15,13,11,0.55)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {!img.isPrimary && (
              <button
                onClick={() => setPrimary(img.id)}
                disabled={loadingId === img.id}
                className="p-1.5 bg-[rgba(184,168,152,0.2)] hover:bg-[rgba(184,168,152,0.35)] rounded-[3px] transition-colors"
                title="Set as primary"
              >
                <Star size={13} className="text-[#B8A898]" />
              </button>
            )}
            <button
              onClick={() => deleteImage(img.id)}
              disabled={loadingId === img.id}
              className="p-1.5 bg-[rgba(154,136,120,0.2)] hover:bg-[rgba(154,136,120,0.35)] rounded-[3px] transition-colors"
              title="Delete image"
            >
              <Trash2 size={13} className="text-[#9A8878]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
