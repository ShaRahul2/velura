'use client'

import { useState } from 'react'
import { pageWrap } from '@/lib/utils'

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
    <div className="border-b border-white/10">
      <div
        className={`${pageWrap} py-12 md:py-16 grid md:grid-cols-[1fr_minmax(0,28rem)] gap-8 md:gap-16 items-end`}
      >
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase mb-3 text-rose">
            Stay close
          </p>
          <h2
            className="font-serif font-light text-blush"
            style={{
              fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            For the nights that begin at 9 PM.
          </h2>
          <p className="font-sans text-[0.86rem] font-light mt-3 text-blush/45 max-w-sm">
            New arrivals. Nothing else.
          </p>
        </div>

        {submitted ? (
          <p className="font-serif text-[1.15rem] italic text-blush pb-1">You&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="flex-1 h-12 px-4 rounded-btn font-sans text-[0.86rem] outline-none text-blush placeholder:text-blush/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose"
                style={{
                  background: 'rgba(237,233,228,0.08)',
                  border: '1px solid rgba(184,168,152,0.25)',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="pressable pressable-track h-12 px-6 rounded-btn font-sans text-[0.78rem] tracking-btn uppercase bg-rose text-deep shrink-0 disabled:opacity-50"
              >
                {loading ? 'Joining' : 'Join'}
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-3 font-sans text-[0.78rem] text-blush/70">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
