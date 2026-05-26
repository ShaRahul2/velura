'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'

const CATEGORIES = ['everyday', 'pushup', 'lace', 'sports', 'seamless', 'plus', 'bridal'] as const
const BADGES     = ['', 'Bestseller', 'New', 'Sale', 'Premium', 'Comfort Fit'] as const
const SUPPORT    = ['Light', 'Medium', 'High'] as const

interface Props {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const router  = useRouter()
  const isEdit  = !!product

  const [fields, setFields] = useState({
    name:     product?.name     ?? '',
    story:    product?.story    ?? '',
    sub:      product?.sub      ?? '',
    price:    product?.price    ?? 0,
    oldPrice: product?.oldPrice ?? '',
    emoji:    product?.emoji    ?? '',
    badge:    product?.badge    ?? '',
    cat:      product?.cat      ?? 'everyday',
    rating:   product?.rating   ?? 4.5,
    reviews:  product?.reviews  ?? 0,
    fabric:   product?.fabric   ?? '',
    support:  product?.support  ?? 'Medium',
    sizes:    product?.sizes    ?? '',
    isActive: product !== undefined ? true : true,
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set<K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      ...fields,
      price:    Number(fields.price),
      oldPrice: fields.oldPrice !== '' ? Number(fields.oldPrice) : null,
      rating:   Number(fields.rating),
      reviews:  Number(fields.reviews),
      badge:    fields.badge || null,
    }

    const url    = isEdit ? `/api/products/${product!.id}` : '/api/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string }).error ?? 'Something went wrong.')
      return
    }

    const data = await res.json()
    const id   = isEdit ? product!.id : (data as { data: { id: number } }).data.id
    router.push(`/admin/products/${id}/edit`)
    router.refresh()
  }

  const inputCls =
    'w-full bg-[rgba(237,233,228,0.04)] border border-[rgba(184,168,152,0.15)] rounded-[3px] px-3 py-2 text-[0.85rem] text-[#EDE9E4] placeholder-[rgba(237,233,228,0.2)] focus:outline-none focus:border-[rgba(184,168,152,0.45)] transition-colors'
  const labelCls =
    'block text-[0.62rem] tracking-[0.12em] text-[rgba(237,233,228,0.4)] uppercase mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Name</label>
          <input
            className={inputCls}
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            required
            placeholder="FeatherSoft T-Shirt Bra"
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Story (editorial 1-liner)</label>
          <input
            className={inputCls}
            value={fields.story}
            onChange={(e) => set('story', e.target.value)}
            required
            placeholder="Disappears under anything. Remembered by your body."
          />
        </div>

        <div className="col-span-2">
          <label className={labelCls}>Sub (fabric · feature · sizes)</label>
          <input
            className={inputCls}
            value={fields.sub}
            onChange={(e) => set('sub', e.target.value)}
            required
            placeholder="Microfibre · Zero-Show · 28A–44DD"
          />
        </div>

        <div>
          <label className={labelCls}>Price (₹)</label>
          <input
            type="number"
            className={inputCls}
            value={fields.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
            min={0}
          />
        </div>

        <div>
          <label className={labelCls}>Old Price (₹, optional)</label>
          <input
            type="number"
            className={inputCls}
            value={fields.oldPrice}
            onChange={(e) => set('oldPrice', e.target.value as unknown as number)}
            min={0}
            placeholder="Leave blank if no sale"
          />
        </div>

        <div>
          <label className={labelCls}>Emoji</label>
          <input
            className={inputCls}
            value={fields.emoji}
            onChange={(e) => set('emoji', e.target.value)}
            required
            placeholder="🩱"
          />
        </div>

        <div>
          <label className={labelCls}>Badge</label>
          <select
            className={inputCls}
            value={fields.badge ?? ''}
            onChange={(e) => set('badge', e.target.value as typeof fields.badge)}
          >
            {BADGES.map((b) => (
              <option key={b} value={b} className="bg-[#1a1816]">
                {b || '— None —'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Category</label>
          <select
            className={inputCls}
            value={fields.cat}
            onChange={(e) => set('cat', e.target.value as typeof fields.cat)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#1a1816]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Support</label>
          <select
            className={inputCls}
            value={fields.support}
            onChange={(e) => set('support', e.target.value as typeof fields.support)}
          >
            {SUPPORT.map((s) => (
              <option key={s} value={s} className="bg-[#1a1816]">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Rating (4.0–5.0)</label>
          <input
            type="number"
            className={inputCls}
            value={fields.rating}
            onChange={(e) => set('rating', Number(e.target.value))}
            min={1} max={5} step={0.1}
          />
        </div>

        <div>
          <label className={labelCls}>Review count</label>
          <input
            type="number"
            className={inputCls}
            value={fields.reviews}
            onChange={(e) => set('reviews', Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className={labelCls}>Fabric</label>
          <input
            className={inputCls}
            value={fields.fabric}
            onChange={(e) => set('fabric', e.target.value)}
            required
            placeholder="95% Polyamide, 5% Elastane"
          />
        </div>

        <div>
          <label className={labelCls}>Sizes</label>
          <input
            className={inputCls}
            value={fields.sizes}
            onChange={(e) => set('sizes', e.target.value)}
            required
            placeholder="28A–44DD"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('isActive', !fields.isActive)}
            className={[
              'w-9 h-5 rounded-[10px] transition-colors relative cursor-pointer',
              fields.isActive ? 'bg-[#B8A898]' : 'bg-[rgba(237,233,228,0.12)]',
            ].join(' ')}
          >
            <div
              className={[
                'absolute top-0.5 w-4 h-4 rounded-full bg-[#EDE9E4] transition-transform',
                fields.isActive ? 'translate-x-4' : 'translate-x-0.5',
              ].join(' ')}
            />
          </div>
          <span className="text-[0.78rem] text-[rgba(237,233,228,0.55)]">
            {fields.isActive ? 'Active — visible in shop' : 'Draft — hidden from shop'}
          </span>
        </label>
      </div>

      {error && (
        <p className="text-[0.75rem] text-[#9A8878]">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#EDE9E4] text-[#0F0D0B] rounded-[3px] text-[0.78rem] tracking-[0.1em] uppercase hover:bg-[#F8F6F3] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[rgba(184,168,152,0.2)] text-[rgba(237,233,228,0.5)] rounded-[3px] text-[0.78rem] tracking-[0.1em] uppercase hover:border-[rgba(184,168,152,0.4)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
