'use client'

import { useState } from 'react'
import type { Product } from '@/types'

const RETURNS = '15 days on unused pieces with tags. Custom builds exchange on defects only. COD under ₹5,000.'

export function ProductMeta({ product }: { product: Product }) {
  const items = [
    {
      id: 'fit',
      label: 'Fit',
      body: `${product.support} support. Sized ${product.sizes}. Band first, then cup — the atelier can place you if the number is uncertain.`,
    },
    {
      id: 'fabric',
      label: 'Fabric & care',
      body: `${product.fabric}. Cold wash, hang to dry, no heat. Keep lace unhooked.`,
    },
    {
      id: 'returns',
      label: 'Returns',
      body: RETURNS,
    },
  ]

  const [open, setOpen] = useState<string | null>('fit')

  return (
    <div className="border-t border-lm mt-2">
      {items.map((item) => {
        const expanded = open === item.id
        return (
          <div key={item.id} className="border-b border-lm">
            <button
              type="button"
              className="w-full flex items-center justify-between py-3.5 font-sans text-[0.72rem] tracking-label uppercase text-deep"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : item.id)}
            >
              {item.label}
              <span className="text-mauve text-[0.9rem] leading-none">{expanded ? '–' : '+'}</span>
            </button>
            {expanded && (
              <p className="pb-4 font-sans text-[0.84rem] font-light text-mauve leading-relaxed">
                {item.body}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
