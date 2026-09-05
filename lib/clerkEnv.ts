export function clerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)
}

/** Clerk's verifier reads CLERK_WEBHOOK_SIGNING_SECRET; accept the shorter alias too. */
export function clerkWebhookSecret() {
  return process.env.CLERK_WEBHOOK_SIGNING_SECRET || process.env.CLERK_WEBHOOK_SECRET || ''
}
