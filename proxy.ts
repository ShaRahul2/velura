import { NextRequest, NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { auth as nextAuth } from '@/auth'
import { requestOrigin, safeAdminCallback } from '@/lib/adminAuth'
import { isClerkConfigured } from '@/lib/clerkConfig'

const isCustomerProtected = createRouteMatcher(['/account(.*)', '/orders(.*)'])
const isAdminPath = createRouteMatcher(['/admin(.*)'])

function redirectAdminLogin(req: NextRequest) {
  const loginUrl = new URL('/admin/login', requestOrigin(req))
  loginUrl.searchParams.set('callbackUrl', safeAdminCallback(req.nextUrl.pathname))
  return NextResponse.redirect(loginUrl)
}

const nextAuthProxy = nextAuth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  if (!isLoginPage && isAdminPath(req) && !req.auth) {
    return redirectAdminLogin(req)
  }
  return NextResponse.next()
})

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (isCustomerProtected(req)) {
    await auth.protect()
  }

  if (isAdminPath(req) && req.nextUrl.pathname !== '/admin/login' && req.nextUrl.pathname !== '/admin/forbidden') {
    const { userId } = await auth()
    if (userId) return NextResponse.next()
    const session = await nextAuth()
    if (session?.user) return NextResponse.next()
    return redirectAdminLogin(req)
  }

  return NextResponse.next()
})

export const proxy = isClerkConfigured() ? clerkProxy : nextAuthProxy

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
