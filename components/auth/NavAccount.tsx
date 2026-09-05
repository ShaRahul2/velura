'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function NavAccount() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) {
    return (
      <Link
        href="/sign-in"
        className="hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
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
          className="hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
          aria-label="Sign in"
        >
          <User size={17} strokeWidth={1.6} aria-hidden="true" />
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/account"
          className="hidden p-2.5 font-sans text-[0.68rem] tracking-btn uppercase text-blush/70 transition-colors hover:text-blush sm:flex"
        >
          Account
        </Link>
        <div className="hidden items-center px-1 sm:flex">
          <UserButton appearance={{ elements: { avatarBox: 'h-7 w-7 rounded-[3px]' } }} />
        </div>
      </SignedIn>
    </>
  )
}
