'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

function AccountIcon({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative hidden p-2.5 text-blush/70 transition-colors hover:text-blush sm:flex"
      aria-label={label}
    >
      <User size={17} strokeWidth={1.6} aria-hidden="true" />
    </Link>
  )
}

export function AccountNavLink() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <AccountIcon href="/sign-in" label="Account" />
  }
  return <ClerkAccountNav />
}

function ClerkAccountNav() {
  const { isSignedIn, user } = useUser()
  if (!isSignedIn) {
    return <AccountIcon href="/sign-in" label="Sign in" />
  }
  return (
    <AccountIcon
      href="/account"
      label={user?.firstName ? `Account, ${user.firstName}` : 'Account'}
    />
  )
}
