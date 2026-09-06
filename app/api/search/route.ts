import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { products as catalog } from '@/data/products'
import { searchCatalog, toSearchHit } from '@/lib/catalogSearch'
import { hasXaiKey, xaiModel } from '@/lib/xai'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'
import type { Product, ProductCategory, SupportLevel } from '@/types'

const IntentSchema = z.object({
  keywords: z.array(z.string()).max(6),
  cat: z.enum(['everyday', 'pushup', 'lace', 'sports', 'seamless', 'plus', 'bridal']).nullable(),
  support: z.enum(['Light', 'Medium', 'High']).nullable(),
})

async function refineQuery(query: string): Promise<{ keywords: string[]; cat?: ProductCategory; support?: SupportLevel }> {
  if (!hasXaiKey()) return { keywords: query.split(/\s+/).filter(Boolean) }
  try {
    const { object } = await generateObject({
      model: xaiModel(),
      schema: IntentSchema,
      system: 'Parse a lingerie shop search into catalog filters. Use only the allowed categories. Return null when unsure.',
      prompt: query,
    })
    return {
      keywords: object.keywords.length > 0 ? object.keywords : query.split(/\s+/),
      cat: object.cat ?? undefined,
      support: object.support ?? undefined,
    }
  } catch {
    return { keywords: query.split(/\s+/).filter(Boolean) }
  }
}

export async function GET(req: Request) {
  if (!await checkRateLimit(`search:${clientIp(req)}`, 40)) {
    return NextResponse.json({ error: 'Too many searches.' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim().slice(0, 80)
  if (q.length < 2) {
    return NextResponse.json({ data: [] })
  }

  let pool: Product[] = catalog
  const intent = await refineQuery(q)
  if (intent.cat) pool = pool.filter((p) => p.cat === intent.cat)
  if (intent.support) pool = pool.filter((p) => p.support === intent.support)

  const ranked = searchCatalog([q, ...intent.keywords].join(' '), pool)
  const data = (ranked.length > 0 ? ranked : searchCatalog(q)).slice(0, 8).map(toSearchHit)

  return NextResponse.json({ data, q })
}
