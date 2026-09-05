'use client'

import { SignOutButton } from '@clerk/nextjs'

export function AccountSignOut() {
  return (
    <SignOutButton>
      <button
        type="button"
        className="font-sans text-[0.72rem] tracking-btn uppercase text-mauve underline underline-offset-4 hover:text-deep"
      >
        Sign out
      </button>
    </SignOutButton>
  )
}
