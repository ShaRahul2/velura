import NextAuth from 'next-auth'
import { timingSafeEqual, createHash } from 'node:crypto'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!await checkRateLimit(`admin-login:${clientIp(request)}`, 10, 15 * 60 * 1000)) return null
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined

        if (
          typeof email === 'string' && typeof password === 'string' &&
          !!process.env.ADMIN_EMAIL && !!process.env.ADMIN_PASSWORD &&
          email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(process.env.ADMIN_PASSWORD).digest())
        ) {
          return { id: 'admin', email: process.env.ADMIN_EMAIL.trim().toLowerCase(), name: 'Admin' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
})
