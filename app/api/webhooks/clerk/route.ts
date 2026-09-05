import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { upsertProfileFromIdentity } from '@/lib/customerAuth'
import { parseProfileRole } from '@/lib/profileRole'

function metadataRole(value: unknown): ReturnType<typeof parseProfileRole> {
  if (typeof value === 'object' && value !== null && 'role' in value) {
    return parseProfileRole((value as { role?: unknown }).role)
  }
  return parseProfileRole(value)
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET ?? process.env.CLERK_WEBHOOK_SIGNING_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 503 })
  }

  let event
  try {
    event = await verifyWebhook(req, { signingSecret: secret })
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const user = event.data
    const email =
      user.email_addresses.find((row) => row.id === user.primary_email_address_id)?.email_address ??
      user.email_addresses[0]?.email_address
    if (!email) {
      return NextResponse.json({ ok: true })
    }
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
    await upsertProfileFromIdentity({
      id: user.id,
      email,
      fullName: fullName || null,
      phone: user.phone_numbers[0]?.phone_number ?? null,
      avatarUrl: user.image_url ?? null,
      metadataRole: metadataRole(user.public_metadata),
    })
  }

  return NextResponse.json({ ok: true })
}
