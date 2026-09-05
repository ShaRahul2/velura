import { z } from 'zod'
const text = z.string().trim().min(1).max(2000)
export const productSchema = z.object({
  name: text.max(160), story: text, sub: text, price: z.number().int().min(1).max(10000000),
  oldPrice: z.number().int().min(1).max(10000000).nullable().optional(), emoji: z.string().max(32),
  badge: z.enum(['Bestseller', 'New', 'Sale', 'Premium', 'Comfort Fit']).nullable().optional(),
  cat: z.enum(['everyday', 'pushup', 'lace', 'sports', 'seamless', 'plus', 'bridal']),
  rating: z.number().min(0).max(5), reviews: z.number().int().min(0).max(10000000),
  fabric: text, support: z.enum(['Light', 'Medium', 'High']), sizes: text.max(200), isActive: z.boolean().optional(),
}).strict()
export function validPrice(data: { price?: number; oldPrice?: number | null }) {
  return data.oldPrice == null || data.price == null || data.oldPrice >= data.price
}
export const categorySchema = z.object({ label: text.max(100), description: z.string().trim().max(2000).nullable(), imageUrl: z.union([z.url().startsWith('https://'), z.literal('')]).nullable(), sortOrder: z.number().int().min(0).max(1000) }).strict()
