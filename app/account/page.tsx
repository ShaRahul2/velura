import type { Metadata } from 'next'
import Link from 'next/link'
import { SignOutButton } from '@clerk/nextjs'
import { requireSignedInProfile } from '@/lib/requireCustomer'
import { db } from '@/lib/db'
import { pageWrap } from '@/lib/utils'
import { AddressManager, ProfileForm } from './AccountForms'

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const profile = await requireSignedInProfile()
  const addresses = await db.address.findMany({
    where: { profileId: profile.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })

  return (
    <div className={`${pageWrap} py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Account</p>
      <h1
        className="mb-3 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}
      >
        Yours.
      </h1>
      <p className="mb-10 max-w-md font-sans text-[0.9rem] font-light text-mauve">
        {profile.email}
      </p>

      <nav className="mb-12 flex flex-wrap gap-5 font-sans text-[0.72rem] uppercase tracking-btn">
        <Link href="/orders" className="text-deep underline underline-offset-4">Orders</Link>
        <Link href="/wishlist" className="text-deep underline underline-offset-4">Saved</Link>
        <SignOutButton>
          <button type="button" className="text-mauve underline underline-offset-4 hover:text-deep">
            Sign out
          </button>
        </SignOutButton>
      </nav>

      <section className="mb-16">
        <h2 className="mb-6 font-serif text-[1.6rem] font-light text-deep">Profile</h2>
        <ProfileForm fullName={profile.fullName ?? ''} phone={profile.phone ?? ''} />
      </section>

      <section>
        <h2 className="mb-6 font-serif text-[1.6rem] font-light text-deep">Addresses</h2>
        <AddressManager addresses={addresses} />
      </section>
    </div>
  )
}
