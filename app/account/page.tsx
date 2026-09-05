import Link from 'next/link'
import { AccountSignOut } from '@/components/account/AccountSignOut'
import { requireCustomerProfile } from '@/lib/customerAuth'
import { listAddresses } from '@/lib/addressBook'
import { ProfileForm } from '@/components/account/ProfileForm'
import { AddressBook } from '@/components/account/AddressBook'
import { pageWrap } from '@/lib/utils'
import { isClerkConfigured } from '@/lib/clerkConfig'
import { AuthUnavailable } from '@/components/account/AuthUnavailable'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  if (!isClerkConfigured()) return <AuthUnavailable />
  const profile = await requireCustomerProfile()
  const addresses = await listAddresses(profile.id)

  return (
    <div className={`${pageWrap} py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Account</p>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.01em' }}
        >
          Your atelier.
        </h1>
        <AccountSignOut />
      </div>

      <nav className="mb-12 flex flex-wrap gap-6 font-sans text-[0.72rem] tracking-btn uppercase">
        <Link href="/orders" className="text-deep underline underline-offset-4">
          Orders
        </Link>
        <Link href="/wishlist" className="text-mauve hover:text-deep">
          Saved
        </Link>
      </nav>

      <section className="mb-16">
        <h2 className="mb-6 font-serif text-[1.6rem] font-light text-deep">Profile</h2>
        <ProfileForm profile={profile} />
      </section>

      <section>
        <h2 className="mb-6 font-serif text-[1.6rem] font-light text-deep">Addresses</h2>
        <AddressBook initial={addresses} />
      </section>
    </div>
  )
}
