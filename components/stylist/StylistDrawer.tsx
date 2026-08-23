'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import type { SearchHit } from '@/lib/catalogSearch'
import type { StylistMessage } from '@/lib/stylist'

const PROMPTS = [
  'Invisible under a white shirt',
  'High support for training',
  'Sage, everyday, with lace',
  'Something for a black dress',
]

interface Turn {
  role: 'user' | 'assistant'
  content: string
  products?: SearchHit[]
}

export function StylistDrawer() {
  const { stylistOpen, closeStylist } = useUiStore()
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!stylistOpen) return
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => fieldRef.current?.focus(), 80)
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeStylist()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [stylistOpen, closeStylist])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, loading])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    setError('')
    setInput('')
    const nextTurns: Turn[] = [...turns, { role: 'user', content }]
    setTurns(nextTurns)
    setLoading(true)

    const messages: StylistMessage[] = nextTurns.map((t) => ({
      role: t.role,
      content: t.content,
    }))

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const json = (await res.json()) as {
        data?: { reply: string; products: SearchHit[] }
        error?: string
      }
      if (!res.ok || !json.data) {
        setError(json.error ?? 'The atelier is briefly unavailable.')
        return
      }
      setTurns([
        ...nextTurns,
        { role: 'assistant', content: json.data.reply, products: json.data.products },
      ])
    } catch {
      setError('The atelier is briefly unavailable.')
    } finally {
      setLoading(false)
    }
  }

  if (!stylistOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(15,13,11,0.55)' }}
        onClick={closeStylist}
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-50 flex flex-col bg-cream"
        style={{ boxShadow: '-6px 0 32px rgba(15,13,11,0.18)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Atelier"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-lm shrink-0">
          <div>
            <p className="font-sans text-[0.62rem] tracking-label uppercase text-rose">Private desk</p>
            <h2 className="font-serif text-[1.2rem] text-deep leading-none mt-0.5">Atelier</h2>
          </div>
          <button
            onClick={closeStylist}
            className="p-2 text-mauve hover:text-deep transition-colors"
            aria-label="Close atelier"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {turns.length === 0 && (
            <div className="flex flex-col gap-4">
              <p className="font-serif text-[1.35rem] font-light text-deep leading-snug">
                Fit, colour, the hour. Ask once.
              </p>
              <p className="font-sans text-[0.84rem] text-mauve font-light">
                I will answer from the collection. Nothing else.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="text-left px-3 py-2.5 border border-lm rounded-btn font-sans text-[0.78rem] text-deep hover:border-deep transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {turns.map((turn, i) => (
            <div key={`${turn.role}-${i}`} className="flex flex-col gap-3">
              {turn.role === 'user' ? (
                <p className="font-sans text-[0.8rem] tracking-[0.08em] uppercase text-mauve">
                  {turn.content}
                </p>
              ) : (
                <>
                  <p className="font-serif text-[1.05rem] font-light text-deep leading-relaxed">
                    {turn.content}
                  </p>
                  {turn.products && turn.products.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {turn.products.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/shop/${product.id}`}
                            onClick={closeStylist}
                            className="flex gap-3 items-center group"
                          >
                            <span
                              className="relative w-12 h-16 shrink-0 overflow-hidden bg-blush rounded-card bg-cover bg-center"
                              style={{ backgroundImage: `url(${product.image})` }}
                            />
                            <span className="min-w-0">
                              <span className="block font-serif text-[0.95rem] text-deep group-hover:opacity-70">
                                {product.name}
                              </span>
                              <span className="block font-sans text-[0.72rem] text-mauve">
                                {formatPrice(product.price)}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}

          {loading && (
            <p className="font-sans text-[0.72rem] tracking-label uppercase text-rose">Considering…</p>
          )}
          {error && <p className="font-sans text-[0.78rem] text-mauve">{error}</p>}
        </div>

        <form
          className="px-6 py-4 border-t border-lm shrink-0 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            void send(input)
          }}
        >
          <input
            ref={fieldRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the atelier"
            maxLength={800}
            className="flex-1 h-11 px-3 rounded-input border border-lm bg-cream font-sans text-[0.86rem] text-deep outline-none focus:border-deep"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-11 px-4 rounded-btn bg-deep text-blush font-sans text-[0.72rem] tracking-btn uppercase disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </aside>
    </>
  )
}
