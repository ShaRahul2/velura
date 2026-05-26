'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@/types'
import { Pencil, Trash2 } from 'lucide-react'

export function AdminProductRow({ product }: { product: Product }) {
  const router   = useRouter()
  const [active, setActive] = useState(true) // products from queryAllProducts are always returned

  async function toggleActive() {
    const next = !active
    setActive(next)
    await fetch(`/api/products/${product.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ isActive: next }),
    })
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This is permanent.`)) return
    await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <tr className="border-b border-[rgba(184,168,152,0.07)] hover:bg-[rgba(237,233,228,0.02)] transition-colors">
      {/* Name + emoji */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{product.emoji}</span>
          <div>
            <p className="text-[0.84rem] text-[#EDE9E4]">{product.name}</p>
            <p className="text-[0.68rem] text-[rgba(237,233,228,0.3)] mt-0.5">
              {product.badge ?? ''}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="text-[0.72rem] text-[rgba(237,233,228,0.45)] capitalize">
          {product.cat}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <span className="text-[0.84rem] text-[#EDE9E4]">₹{product.price.toLocaleString('en-IN')}</span>
        {product.oldPrice && (
          <span className="text-[0.68rem] text-[rgba(237,233,228,0.3)] ml-2 line-through">
            ₹{product.oldPrice.toLocaleString('en-IN')}
          </span>
        )}
      </td>

      {/* Active toggle */}
      <td className="px-4 py-3">
        <button
          onClick={toggleActive}
          className="flex items-center gap-2 group"
          type="button"
        >
          <div
            className={[
              'w-8 h-4 rounded-[8px] transition-colors relative',
              active ? 'bg-[#B8A898]' : 'bg-[rgba(237,233,228,0.12)]',
            ].join(' ')}
          >
            <div
              className={[
                'absolute top-0.5 w-3 h-3 rounded-full bg-[#EDE9E4] transition-transform',
                active ? 'translate-x-4' : 'translate-x-0.5',
              ].join(' ')}
            />
          </div>
          <span className="text-[0.65rem] text-[rgba(237,233,228,0.35)] tracking-[0.08em]">
            {active ? 'Active' : 'Draft'}
          </span>
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-1.5 rounded-[3px] text-[rgba(237,233,228,0.35)] hover:text-[rgba(237,233,228,0.7)] hover:bg-[rgba(237,233,228,0.06)] transition-colors"
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-[3px] text-[rgba(154,136,120,0.4)] hover:text-[#9A8878] hover:bg-[rgba(154,136,120,0.08)] transition-colors"
            type="button"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}
