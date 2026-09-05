import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { requestOrigin, safeAdminCallback } from '@/lib/adminAuth'

export const proxy = auth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (!isLoginPage && !req.auth) {
    const loginUrl = new URL('/admin/login', requestOrigin(req))
    loginUrl.searchParams.set('callbackUrl', safeAdminCallback(req.nextUrl.pathname))
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
