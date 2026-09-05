'use client'

export const dynamic = 'force-dynamic'

import { useState, FormEvent, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { safeAdminCallback } from '@/lib/adminAuth'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeAdminCallback(searchParams.get('callbackUrl'))

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.ok) { router.replace(callbackUrl); router.refresh() }
      else setError('Invalid credentials or too many attempts. Please try again.')
    } catch { setError('Could not sign in. Check your connection and try again.') }
    finally { setLoading(false) }

  }

  return (
    <div className="min-h-screen bg-[#0F0D0B] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            className="text-[#EDE9E4] text-xl font-sans"
            style={{ letterSpacing: '0.22em' }}
          >
            VELURA
          </span>
          <p className="text-[#B8A898] text-[0.65rem] tracking-[0.18em] uppercase mt-2">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[0.65rem] tracking-[0.12em] text-[rgba(237,233,228,0.45)] uppercase mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[rgba(237,233,228,0.06)] border border-[rgba(184,168,152,0.2)] rounded-[3px] px-4 py-2.5 text-[0.88rem] text-[#EDE9E4] placeholder-[rgba(237,233,228,0.2)] focus:outline-none focus:border-[rgba(184,168,152,0.5)] transition-colors"
              placeholder="admin@velura.in"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[0.65rem] tracking-[0.12em] text-[rgba(237,233,228,0.45)] uppercase mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[rgba(237,233,228,0.06)] border border-[rgba(184,168,152,0.2)] rounded-[3px] px-4 py-2.5 text-[0.88rem] text-[#EDE9E4] placeholder-[rgba(237,233,228,0.2)] focus:outline-none focus:border-[rgba(184,168,152,0.5)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-[0.75rem] text-[#9A8878] tracking-[0.04em]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EDE9E4] text-[#0F0D0B] rounded-[3px] py-2.5 text-[0.8rem] tracking-[0.12em] uppercase font-medium hover:bg-[#F8F6F3] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
