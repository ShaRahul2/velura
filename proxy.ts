import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { auth as nextAuth } from '@/auth'
import { requestOrigin, safeAdminCallback } from '@/lib/adminAuth'
import { clerkConfigured } from '@/lib/clerkEnv'

const isCustomerProtected = createRouteMatcher(['/account(.*)', '/wishlist(.*)', '/orders(.*)'])

const nextAuthAdmin = nextAuth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  if (!isLoginPage && !req.auth) {
    const loginUrl = new URL('/admin/login', requestOrigin(req))
    loginUrl.searchParams.set('callbackUrl', safeAdminCallback(req.nextUrl.pathname))
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
})

function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin')
}

async function credentialsAdminOnly(req: Parameters<typeof nextAuthAdmin>[0], event: never) {
  const { pathname } = req.nextUrl
  if (isAdminPath(pathname) && pathname !== '/admin/login' && pathname !== '/admin/denied') {
    return nextAuthAdmin(req, event)
  }
  return NextResponse.next()
}

export default clerkConfigured()
  ? clerkMiddleware(async (auth, req, event) => {
      if (isCustomerProtected(req)) {
        await auth.protect({
          unauthenticatedUrl: new URL('/sign-in', requestOrigin(req)).toString(),
        })
      }

      const { pathname } = req.nextUrl
      if (isAdminPath(pathname) && pathname !== '/admin/login' && pathname !== '/admin/denied') {
        const { userId } = await auth()
        if (userId) return NextResponse.next()
        return nextAuthAdmin(req, event as never)
      }

      return NextResponse.next()
    })
  : credentialsAdminOnly

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
