'use client'

import Link from 'next/link'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/Button'
import { pageWrap } from '@/lib/utils'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const hydrated = useCartHydrated()

  if (!hydrated) {
    return <div className={`${pageWrap} py-16`} aria-hidden="true"><div className="h-40 bg-blush" /></div>
  }

  return (
    <div className={`${pageWrap} max-w-[40rem] py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Bag</p>
      <h1
        className="mb-10 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.01em' }}
      >
        Your bag.
      </h1>
      {items.length === 0 ? (
        <div>
          <p className="mb-6 font-sans text-[0.95rem] font-light text-mauve">Your bag is empty.</p>
          <Link
            href="/shop"
            className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-deep px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.size}-${item.color ?? ''}`} item={item} />
          ))}
          <div className="mt-8 space-y-4">
            <CartSummary subtotal={total()} />
            <Link href="/checkout">
              <Button variant="dark" size="lg" className="w-full">
                Place Order
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
