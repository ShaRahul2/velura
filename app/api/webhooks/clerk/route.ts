import { NextRequest } from 'next/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { upsertProfileFromClerk } from '@/lib/profiles'
import { parseClerkRole } from '@/lib/accountRoles'
import { clerkWebhookSecret } from '@/lib/clerkEnv'

export async function POST(req: NextRequest) {
  const signingSecret = clerkWebhookSecret()
  if (!signingSecret) {
    return new Response('webhook secret is not configured', { status: 503 })
  }

  try {
    const event = await verifyWebhook(req, { signingSecret })
    if (event.type === 'user.created' || event.type === 'user.updated') {
      const user = event.data
      const email =
        user.email_addresses.find((row) => row.id === user.primary_email_address_id)?.email_address ??
        user.email_addresses[0]?.email_address ??
        ''
      await upsertProfileFromClerk({
        id: user.id,
        email,
        fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || null,
        avatarUrl: user.image_url ?? null,
        phone: user.phone_numbers[0]?.phone_number ?? null,
        role: parseClerkRole(user.public_metadata),
      })
    }
    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('[clerk webhook]', err)
    return new Response('invalid', { status: 400 })
  }
}
