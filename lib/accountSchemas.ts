import { z } from 'zod'
import type { BuilderState, CartItem } from '@/types'

export const cartItemSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(200),
  price: z.number().int().nonnegative(),
  qty: z.number().int().min(1).max(20),
  size: z.string().min(1).max(40),
  emoji: z.string().max(16).optional().default(''),
  images: z.array(z.string()).max(8).optional().default([]),
  color: z.string().max(32).optional(),
  colorLabel: z.string().max(80).optional(),
  isCustom: z.boolean().optional(),
  customSpec: z.unknown().optional(),
  customGrad: z.string().max(400).optional(),
})

export const cartItemsSchema = z.array(cartItemSchema).max(50)
export const wishlistIdsSchema = z.array(z.number().int().positive()).max(100)

export function asCartItems(items: z.infer<typeof cartItemsSchema>): CartItem[] {
  return items.map((item) => ({
    ...item,
    customSpec: item.customSpec as BuilderState | undefined,
  }))
}
