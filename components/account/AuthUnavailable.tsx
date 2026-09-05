import { pageWrap } from '@/lib/utils'

export function AuthUnavailable() {
  return (
    <div className={`${pageWrap} max-w-lg py-20`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Account</p>
      <h1
        className="mb-4 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.01em' }}
      >
        Sign-in is being set.
      </h1>
      <p className="font-sans text-[0.92rem] font-light leading-relaxed text-mauve">
        Clerk keys are not on this environment yet. Add{' '}
        <code className="text-deep">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{' '}
        <code className="text-deep">CLERK_SECRET_KEY</code>, then Google and email sign-in will open here.
      </p>
    </div>
  )
}
