'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/admin/products'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      router.push(callbackUrl)
    } else {
      setError('Invalid credentials.')
    }
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
            <label className="block text-[0.65rem] tracking-[0.12em] text-[rgba(237,233,228,0.45)] uppercase mb-1.5">
              Email
            </label>
            <input
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
            <label className="block text-[0.65rem] tracking-[0.12em] text-[rgba(237,233,228,0.45)] uppercase mb-1.5">
              Password
            </label>
            <input
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
            <p className="text-[0.75rem] text-[#9A8878] tracking-[0.04em]">{error}</p>
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
