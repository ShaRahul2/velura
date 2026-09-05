'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerkAppearance'

export function AuthProviders({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return <>{children}</>

  return (
    <ClerkProvider
      publishableKey={key}
      appearance={clerkAppearance}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/account"
      signUpFallbackRedirectUrl="/account"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  )
}
