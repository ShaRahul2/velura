'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import type { CartItem } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const CART_DEBOUNCE_MS = 400

export function AccountSync() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!clerkKey) return null
  return <AccountSyncInner />
}

function AccountSyncInner() {
  const { isSignedIn, isLoaded } = useAuth()
  const ready = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      ready.current = false
      return
    }

    let cancelled = false
    ready.current = false

    const guestCart = useCartStore.getState().items
    const guestWish = useWishlistStore.getState().ids

    void (async () => {
      try {
        const res = await fetch('/api/account/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: guestCart, wishlist: guestWish }),
        })
        const json = (await res.json()) as { data?: { cart: CartItem[]; wishlist: number[] } }
        if (!res.ok || !json.data || cancelled) return
        useCartStore.setState({ items: json.data.cart })
        useWishlistStore.setState({ ids: json.data.wishlist })
      } catch {
        /* keep guest state */
      } finally {
        if (!cancelled) ready.current = true
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (!isSignedIn) return

    const persistCart = (items: CartItem[]) => {
      if (!ready.current) return
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        void fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        })
      }, CART_DEBOUNCE_MS)
    }

    const persistWish = (ids: number[]) => {
      if (!ready.current) return
      void fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
    }

    const unsubCart = useCartStore.subscribe((state, prev) => {
      if (state.items === prev.items) return
      persistCart(state.items)
    })
    const unsubWish = useWishlistStore.subscribe((state, prev) => {
      if (state.ids === prev.ids) return
      persistWish(state.ids)
    })

    return () => {
      unsubCart()
      unsubWish()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [isSignedIn])

  return null
}
