'use client'

import Image from 'next/image'
import type { CartItem as CartItemType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { Minus, Plus, X } from 'lucide-react'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQty = useCartStore((s) => s.updateQty)
  const remove    = useCartStore((s) => s.remove)

  return (
    <div className="flex gap-3 py-4 border-b border-lm last:border-0">
      {/* Image */}
      <div
        className="w-16 h-20 shrink-0 rounded-card overflow-hidden relative bg-blush flex items-center justify-center"
      >
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span className="text-2xl">{item.emoji}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-[0.95rem] lg:text-[1.02rem] font-[500] text-deep leading-tight truncate">
            {item.name}
          </h4>
          <button
            onClick={() => remove(item.id, item.size)}
            className="shrink-0 text-mauve hover:text-deep transition-colors p-0.5"
            aria-label="Remove item"
          >
            <X size={13} />
          </button>
        </div>

        <p className="font-sans text-[0.72rem] lg:text-[0.78rem] text-mauve">Size: {item.size}</p>

        {item.isCustom && (
          <div className="flex items-center gap-1.5">
            <p className="font-sans text-[0.68rem] lg:text-[0.74rem] text-rose">Custom Build</p>
            {item.customSpec?.color && (
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border border-lm"
                style={{ background: CB_COLOR_OPTIONS.find(c => c.id === item.customSpec!.color)?.color || '#EDE9E4' }}
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Qty controls */}
          <div className="flex items-center border border-lm rounded-[2px] overflow-hidden">
            <button
              onClick={() => updateQty(item.id, item.size, -1)}
              className="w-7 h-7 flex items-center justify-center text-mauve hover:bg-blush transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span className="w-7 text-center font-sans text-[0.78rem] lg:text-[0.84rem] text-deep">
              {item.qty}
            </span>
            <button
              onClick={() => updateQty(item.id, item.size, 1)}
              className="w-7 h-7 flex items-center justify-center text-mauve hover:bg-blush transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>

          <span className="font-sans text-[0.9rem] lg:text-[0.98rem] text-deep">
            {formatPrice(item.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  )
}
