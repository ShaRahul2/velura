export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  )
}

export const CLERK_SIGN_IN_PATH = '/sign-in'
export const CLERK_SIGN_UP_PATH = '/sign-up'
export const CLERK_AFTER_AUTH_PATH = '/account'
