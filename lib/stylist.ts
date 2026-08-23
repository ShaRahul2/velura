import { generateObject } from 'ai'
import { z } from 'zod'
import { catalogDigest, searchCatalog, toSearchHit, type SearchHit } from '@/lib/catalogSearch'
import { hasXaiKey, xaiModel } from '@/lib/xai'
import { products as catalog } from '@/data/products'

const ReplySchema = z.object({
  reply: z.string().min(1).max(900),
  productIds: z.array(z.number().int()).max(4),
})

const SYSTEM = `You are the Velura atelier — a private stylist for a luxury-accessible Indian lingerie house.
Voice: spare, confident, editorial. Think The Row, never Zara. Never say "you deserve", "amazing", "shop now", or "feel beautiful".
You help with fit, colour, fabric, what disappears under clothes, and which piece from THIS catalog to wear.
Only recommend product ids from the catalog JSON. If nothing fits, say so and point to /builder.
Prices are INR. Sizes run 26AA–52K. Free shipping from ₹999.
Keep replies under 90 words. No emoji. No markdown headings.`

export interface StylistMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StylistResult {
  reply: string
  products: SearchHit[]
  source: 'xai' | 'fallback'
}

function hitsFromIds(ids: number[]): SearchHit[] {
  const unique = [...new Set(ids)]
  return unique
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4)
    .map(toSearchHit)
}

function fallbackReply(latest: string): StylistResult {
  const matches = searchCatalog(latest).slice(0, 3)
  if (matches.length === 0) {
    return {
      reply: 'Tell me the neckline, the hour, or the support you want. I will pull from the collection — or we build yours.',
      products: catalog.filter((p) => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 3).map(toSearchHit),
      source: 'fallback',
    }
  }
  const names = matches.map((p) => p.name).join(', ')
  return {
    reply: `From the collection: ${names}. Quiet enough for the day. Precise enough that you will not think about them.`,
    products: matches.map(toSearchHit),
    source: 'fallback',
  }
}

export async function askStylist(messages: StylistMessage[]): Promise<StylistResult> {
  const latest = messages.filter((m) => m.role === 'user').at(-1)?.content?.trim() ?? ''
  if (!latest) {
    return {
      reply: 'What are you dressing for.',
      products: [],
      source: 'fallback',
    }
  }

  if (!hasXaiKey()) return fallbackReply(latest)

  try {
    const history = messages
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Client' : 'Atelier'}: ${m.content.slice(0, 600)}`)
      .join('\n')

    const { object } = await generateObject({
      model: xaiModel(),
      schema: ReplySchema,
      system: `${SYSTEM}\n\nCatalog:\n${JSON.stringify(catalogDigest())}`,
      prompt: history,
    })

    const products = hitsFromIds(object.productIds)
    return {
      reply: object.reply.trim(),
      products: products.length > 0 ? products : searchCatalog(latest).slice(0, 3).map(toSearchHit),
      source: 'xai',
    }
  } catch {
    return fallbackReply(latest)
  }
}
