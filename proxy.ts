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
  if (isAdminPath(pathname) && pathname !== '/admin/login' && pathname !== '/admin/denied' && pathname !== '/admin/forbidden') {
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
      if (isAdminPath(pathname) && pathname !== '/admin/login' && pathname !== '/admin/denied' && pathname !== '/admin/forbidden') {
        const { userId } = await auth()
        if (userId) return NextResponse.next()
        return nextAuthAdmin(req, event as never)
      }

      return NextResponse.next()
    })
  : credentialsAdminOnly

/**
 * Clerk handshake on every document request sets cookies / private Cache-Control,
 * which prevents CDN HIT on the public catalog. Keep middleware on auth surfaces
 * only; ClerkProvider still hydrates the session on public pages.
 */
export const config = {
  matcher: [
    '/account(.*)',
    '/wishlist(.*)',
    '/orders(.*)',
    '/admin(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/((?!builder-preview).*)',
    '/__clerk(.*)',
  ],
}
