'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { shouldBypassImageOptimizer } from '@/lib/imageOptimizer'

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

  const [error, setError] = useState('')
  async function mutate(imageId: number, primary: boolean) {
    if (!primary && !confirm('Delete this image? This cannot be undone.')) return
    setLoadingId(imageId); setError('')
    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}${primary ? '/primary' : ''}`, {method: primary ? 'PATCH' : 'DELETE'})
      if (!res.ok) throw new Error('Could not update image. Please retry.')
      await onRefresh()
    } catch(e) { setError(e instanceof Error ? e.message : 'Request failed.') }
    finally { setLoadingId(null) }
  }
  async function moveImage(imageId: number, direction: 'earlier' | 'later') {
    setLoadingId(imageId); setError('')
    try {
      const res=await fetch(`/api/products/${productId}/images/${imageId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({direction})})
      if(!res.ok) throw new Error('Could not reorder image. Please retry.')
      await onRefresh()
    } catch(e) { setError(e instanceof Error ? e.message : 'Request failed.') }
    finally { setLoadingId(null) }
  }
  async function setPrimary(id: number) { await mutate(id, true) }
  async function deleteImage(id: number) { await mutate(id, false) }

  if (images.length === 0) {
    return (
      <p className="text-[0.78rem] text-[rgba(237,233,228,0.3)] italic">
        No images yet — upload one below.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {error && <p role="alert" className="col-span-full text-red-300 text-sm">{error}</p>}
      {images.map((img, index) => (
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
              unoptimized={shouldBypassImageOptimizer(img.url)}
            />
          </div>

          {/* Primary badge */}
          {img.isPrimary && (
            <div className="absolute top-1.5 left-1.5 bg-[rgba(15,13,11,0.75)] rounded-[2px] px-1.5 py-0.5 flex items-center gap-1">
              <Star size={9} fill="#B8A898" stroke="none" />
              <span className="text-[0.55rem] text-[#B8A898] tracking-[0.1em] uppercase">Primary</span>
            </div>
          )}

          <div className="absolute top-1 right-1 z-10 flex rounded bg-[#0F0D0B]/90">
            <button type="button" aria-label="Move image earlier" disabled={loadingId !== null || index === 0} onClick={()=>moveImage(img.id,'earlier')} className="flex h-11 w-11 items-center justify-center"><ArrowLeft size={14}/></button>
            <button type="button" aria-label="Move image later" disabled={loadingId !== null || index === images.length-1} onClick={()=>moveImage(img.id,'later')} className="flex h-11 w-11 items-center justify-center"><ArrowRight size={14}/></button>
          </div>
          {/* Type label */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(15,13,11,0.7)] to-transparent px-2 py-1.5">
            <span className="text-[0.55rem] text-[rgba(237,233,228,0.6)] tracking-[0.1em] uppercase">
              {img.type}
            </span>
          </div>

          {/* Actions — appear on hover */}
          <div className="absolute inset-0 bg-[rgba(15,13,11,0.55)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {!img.isPrimary && (
              <button
                onClick={() => setPrimary(img.id)}
                disabled={loadingId !== null}
                className="min-h-11 min-w-11 flex items-center justify-center bg-[rgba(184,168,152,0.2)] hover:bg-[rgba(184,168,152,0.35)] rounded-[3px] transition-colors"
                title="Set as primary"
              >
                <Star size={13} className="text-[#B8A898]" />
              </button>
            )}
            <button
              onClick={() => deleteImage(img.id)}
              disabled={loadingId !== null}
              className="min-h-11 min-w-11 flex items-center justify-center bg-[rgba(154,136,120,0.2)] hover:bg-[rgba(154,136,120,0.35)] rounded-[3px] transition-colors"
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
