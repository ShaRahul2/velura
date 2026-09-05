import { SignIn } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/clerkConfig'
import { veluraClerkAppearance } from '@/lib/clerkAppearance'
import { AuthUnavailable } from '@/components/account/AuthUnavailable'
import { pageWrap } from '@/lib/utils'

export default function SignInPage() {
  if (!isClerkConfigured()) return <AuthUnavailable />
  return (
    <div className={`${pageWrap} flex justify-center py-16 md:py-24`}>
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/account"
        appearance={veluraClerkAppearance}
      />
    </div>
  )
}
