import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerkAppearance'
import { pageWrap } from '@/lib/utils'

export default function SignInPage() {
  return (
    <div className={`${pageWrap} flex min-h-[70vh] flex-col items-center py-16`}>
      <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">Account</p>
      <h1
        className="mb-10 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        Sign in.
      </h1>
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <SignIn
          appearance={clerkAppearance}
          fallbackRedirectUrl="/account"
          signUpUrl="/sign-up"
        />
      ) : (
        <p className="max-w-sm text-center font-sans text-[0.9rem] font-light text-mauve">
          Customer accounts are not configured on this deployment. Set Clerk keys on Vercel and redeploy.
        </p>
      )}
    </div>
  )
}
