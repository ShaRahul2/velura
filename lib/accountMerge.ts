import type { CartItem } from '@/types'
import { lineKey } from '@/lib/cartLine'

export function mergeCartItems(server: CartItem[], guest: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>()
  for (const item of server) map.set(lineKey(item), { ...item })
  for (const item of guest) {
    const key = lineKey(item)
    const prev = map.get(key)
    if (prev) {
      map.set(key, { ...prev, qty: Math.min(10, prev.qty + item.qty) })
    } else {
      map.set(key, { ...item, qty: Math.min(10, Math.max(1, item.qty)) })
    }
  }
  return [...map.values()]
}

export function mergeWishlistIds(server: number[], guest: number[]) {
  return [...new Set([...server, ...guest])]
}
