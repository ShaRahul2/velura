'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { veluraClerkAppearance } from '@/lib/clerkAppearance'
import { AccountSync } from '@/components/account/AccountSync'

export function ClerkRoot({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!publishableKey) return <>{children}</>
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={veluraClerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/account"
      signUpFallbackRedirectUrl="/account"
      afterSignOutUrl="/"
    >
      <AccountSync />
      {children}
    </ClerkProvider>
  )
}
