import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

// Stable cart-line key: same product in different sizes = different lines
function lineKey(item: Pick<CartItem, 'id' | 'size'>) {
  return `${item.id}::${item.size}`
}

interface CartStore {
  items:     CartItem[]
  add:       (item: CartItem) => void
  remove:    (id: number, size: string) => void
  updateQty: (id: number, size: string, delta: number) => void
  clear:     () => void
  total:     () => number
  count:     () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const key = lineKey(item)
          const existingIndex = state.items.findIndex((i) => lineKey(i) === key)
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

      remove: (id, size) =>
        set((state) => ({
          items: state.items.filter((item) => lineKey(item) !== lineKey({ id, size })),
        })),

      updateQty: (id, size, delta) =>
        set((state) => ({
          items: state.items.map((item) =>
            lineKey(item) === lineKey({ id, size })
              ? { ...item, qty: Math.max(1, item.qty + delta) }
              : item
          ),
        })),

      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      count: () => get().items.length,
    }),
    {
      name: 'velura-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export const useCart = useCartStore
