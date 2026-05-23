import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: number) => void
  updateQty: (id: number, delta: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (existing) => existing.id === item.id && existing.size === item.size
          )

          if (existingIndex >= 0) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              qty: updated[existingIndex].qty + item.qty,
            }
            return { items: updated }
          }

          return { items: [...state.items, item] }
        }),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQty: (id, delta) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, qty: Math.max(1, item.qty + delta) }
              : item
          ),
        })),
      clear: () => ({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      count: () => get().items.length,
    }),
    {
      name: 'velura-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export const useCart = useCartStore
