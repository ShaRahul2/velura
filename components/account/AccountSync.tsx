'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { CartItem } from '@/types'

let applyingServer = false

export function AccountSync() {
  const { isLoaded, isSignedIn } = useAuth()
  const merged = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || merged.current) return
    merged.current = true
    const guestItems = useCartStore.getState().items
    const guestIds = useWishlistStore.getState().ids

    void (async () => {
      try {
        if (guestItems.length > 0) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: guestItems }),
          })
        }
        if (guestIds.length > 0) {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: guestIds }),
          })
        }
        const [cartRes, wishRes] = await Promise.all([fetch('/api/cart'), fetch('/api/wishlist')])
        const cartJson = cartRes.ok ? ((await cartRes.json()) as { data?: CartItem[] }) : {}
        const wishJson = wishRes.ok ? ((await wishRes.json()) as { data?: number[] }) : {}
        applyingServer = true
        if (Array.isArray(cartJson.data)) useCartStore.setState({ items: cartJson.data })
        if (Array.isArray(wishJson.data)) useWishlistStore.setState({ ids: wishJson.data })
      } catch {
        /* stay on guest cache */
      } finally {
        applyingServer = false
      }
    })()
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    if (!isSignedIn) {
      merged.current = false
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubCart = useCartStore.subscribe((state) => {
      if (applyingServer) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        void fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: state.items }),
        })
      }, 350)
    })
    const unsubWish = useWishlistStore.subscribe((state) => {
      if (applyingServer) return
      void fetch('/api/wishlist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: state.ids }),
      })
    })
    return () => {
      unsubCart()
      unsubWish()
      if (timer) clearTimeout(timer)
    }
  }, [isSignedIn])

  return null
}
