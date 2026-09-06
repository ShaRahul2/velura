import { NextResponse } from 'next/server'
import { z } from 'zod'
import { askStylist } from '@/lib/stylist'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(800),
      })
    )
    .min(1)
    .max(12),
})

export async function POST(req: Request) {
  if (!await checkRateLimit(`stylist:${clientIp(req)}`, 20)) {
    return NextResponse.json({ error: 'Please wait before asking again.' }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ask in a short sentence.' }, { status: 400 })
  }

  const last = parsed.data.messages.at(-1)
  if (last?.role !== 'user') {
    return NextResponse.json({ error: 'Ask in a short sentence.' }, { status: 400 })
  }

  try {
    const result = await askStylist(parsed.data.messages)
    return NextResponse.json({ data: result })
  } catch {
    return NextResponse.json({ error: 'The atelier is briefly unavailable.' }, { status: 502 })
  }
}
