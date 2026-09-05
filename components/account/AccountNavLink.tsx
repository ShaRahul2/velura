'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

export function AccountNavLink() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <Link
        href="/sign-in"
        className="relative hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
        aria-label="Account"
      >
        <User size={17} strokeWidth={1.6} aria-hidden="true" />
      </Link>
    )
  }
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="relative hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
          aria-label="Sign in"
        >
          <User size={17} strokeWidth={1.6} aria-hidden="true" />
        </Link>
      </SignedOut>
      <SignedIn>
        <AccountNavSignedIn />
      </SignedIn>
    </>
  )
}

function AccountNavSignedIn() {
  const { user } = useUser()
  return (
    <Link
      href="/account"
      className="relative hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
      aria-label={user?.firstName ? `Account, ${user.firstName}` : 'Account'}
    >
      <User size={17} strokeWidth={1.6} aria-hidden="true" />
    </Link>
  )
}
