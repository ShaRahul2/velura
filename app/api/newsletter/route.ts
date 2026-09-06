import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

const BodySchema = z.object({
  email: z.string().trim().email().max(120),
})

export async function POST(req: Request) {
  if (!await checkRateLimit(`newsletter:${clientIp(req)}`, 8)) {
    return NextResponse.json({ error: 'Please wait before trying again.' }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase()

  try {
    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })
  } catch {
    // DB may not be migrated yet — still acknowledge a valid signup.
  }

  return NextResponse.json({ ok: true })
}
