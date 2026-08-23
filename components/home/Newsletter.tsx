'use client'

import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        setError(json.error ?? 'Could not join the list.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Could not join the list.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="py-16 md:py-20 px-5"
      style={{ background: 'linear-gradient(135deg, #0F0D0B 0%, #2A2420 100%)' }}
    >
      <div className="max-w-lg mx-auto text-center">
        <p className="font-sans text-[0.68rem] tracking-label uppercase mb-4" style={{ color: '#B8A898' }}>
          Stay close
        </p>
        <h2
          className="font-serif font-light mb-4"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            letterSpacing: '-0.01em',
            color: '#EDE9E4',
          }}
        >
          For the nights that begin at 9 PM.
        </h2>
        <p className="font-sans text-[0.9rem] font-light mb-8" style={{ color: 'rgba(237,233,228,0.45)' }}>
          New arrivals. Exclusive offers. Nothing else.
        </p>

        {submitted ? (
          <p className="font-serif text-[1.1rem] italic" style={{ color: '#EDE9E4' }}>
            You&apos;re on the list.
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 h-12 px-4 rounded-btn font-sans text-[0.86rem] outline-none focus:ring-1 focus:ring-rose"
                style={{
                  background: 'rgba(237,233,228,0.08)',
                  border: '1px solid rgba(184,168,152,0.25)',
                  color: '#EDE9E4',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 px-6 rounded-btn font-sans text-[0.78rem] tracking-btn uppercase transition-all duration-200 hover:tracking-wide shrink-0 disabled:opacity-50"
                style={{ background: '#B8A898', color: '#0F0D0B' }}
              >
                {loading ? 'Joining' : 'Join'}
              </button>
            </form>
            {error && (
              <p className="mt-3 font-sans text-[0.78rem]" style={{ color: 'rgba(237,233,228,0.7)' }}>
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
