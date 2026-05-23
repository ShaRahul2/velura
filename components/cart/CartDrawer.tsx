'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUiStore()
  const { items, total } = useCartStore()

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(15,13,11,0.55)' }}
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-50 flex flex-col bg-cream"
        style={{
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.23,1,0.32,1)',
          boxShadow: cartOpen ? '-6px 0 32px rgba(15,13,11,0.18)' : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-lm shrink-0">
          <h2 className="font-serif text-[1.2rem] text-deep">Your Bag</h2>
          <button
            onClick={closeCart}
            className="p-2 text-mauve hover:text-deep transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <p className="font-serif text-[1.4rem] text-deep">Your bag is empty.</p>
              <p className="font-sans text-[0.82rem] text-mauve">
                Invisible, weightless, unforgettable.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 font-sans text-[0.8rem] tracking-btn uppercase underline underline-offset-4 text-mauve hover:text-deep transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => <CartItem key={`${item.id}-${item.size}`} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-lm shrink-0 flex flex-col gap-4 bg-cream">
            <CartSummary subtotal={total()} />
            <Link href="/checkout" onClick={closeCart}>
              <Button variant="dark" size="lg" className="w-full">
                Place Order
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
