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

export default clerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isCustomerProtected(req)) {
        await auth.protect({
          unauthenticatedUrl: new URL('/sign-in', requestOrigin(req)).toString(),
        })
      }

      const { pathname } = req.nextUrl
      if (isAdminPath(pathname) && pathname !== '/admin/login' && pathname !== '/admin/denied') {
        const { userId } = await auth()
        if (userId) return NextResponse.next()
        return nextAuthAdmin(req, undefined as never)
      }

      return NextResponse.next()
    })
  : nextAuthAdmin

export const config = {
  matcher: clerkConfigured()
    ? [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/__clerk/(.*)',
      ]
    : ['/admin/:path*'],
}
