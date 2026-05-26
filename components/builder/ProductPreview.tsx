'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useBuilderStore } from '@/store/builderStore'
import { BraSVG } from './BraSVG'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'
import { formatPrice } from '@/lib/utils'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'

const STEP_LABELS = ['Size', 'Type', 'Style', 'Fabric', 'Review']

interface ProductPreviewProps {
  currentStep: number
}

type AIState = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

export function ProductPreview({ currentStep }: ProductPreviewProps) {
  const store = useBuilderStore()
  const { braType, color, fabric, band, cup, price } = store

  const spec             = buildVisualSpec(store)
  const selectedColor    = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const bgColor          = selectedColor?.color ?? '#EDE9E4'
  const isDark           = ['deep', 'black', 'slate', 'mauve', 'navy', 'forest', 'burgundy', 'cobalt', 'red'].includes(color ?? '')
  const size             = band && cup ? `${band}${cup}` : '—'

  // ── AI preview state ────────────────────────────────────────────────────────
  const [aiState,  setAiState]  = useState<AIState>('idle')
  const [aiUrl,    setAiUrl]    = useState<string | null>(null)
  const [aiError,  setAiError]  = useState<string>('')
  const [showAI,   setShowAI]   = useState(false)  // toggle between SVG and AI preview

  // Reset AI preview when the spec changes (user made a selection)
  const prevHashRef = useRef<string>('')
  const currentHash = specToHash(spec)
  useEffect(() => {
    if (prevHashRef.current && prevHashRef.current !== currentHash) {
      setAiState('idle')
      setAiUrl(null)
      setShowAI(false)
    }
    prevHashRef.current = currentHash
  }, [currentHash])

  // Show "Generate AI Preview" button once enough selections are made (step ≥ 3)
  const canGenerate = currentStep >= 3 && !!braType && !!fabric && !!color

  async function handleGenerateAI() {
    setAiState('loading')
    setAiError('')
    try {
      const res = await fetch('/api/builder-preview/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ spec }),
      })
      const data: unknown = await res.json()
      const obj = data as Record<string, unknown>

      if (res.status === 503 && obj.code === 'NO_API_KEY') {
        setAiState('unavailable')
        setAiError('AI preview is not yet enabled for this store.')
        return
      }
      if (res.status === 402 && obj.code === 'INSUFFICIENT_CREDITS') {
        setAiState('unavailable')
        setAiError('AI preview needs billing setup. The diagram above shows your exact spec.')
        return
      }
      if (!res.ok) {
        throw new Error((obj.error as string) ?? 'Generation failed')
      }
      const url = obj.url as string
      setAiUrl(url)
      setAiState('success')
      setShowAI(true)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      setAiState('error')
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">

      {/* ── Preview area ─────────────────────────────────── */}
      <div className="relative">
        {/* SVG preview — always rendered, hidden when AI image is shown */}
        <div
          className="rounded-card flex flex-col items-center justify-center p-8 transition-colors duration-500 min-h-[260px]"
          style={{
            background:      `linear-gradient(160deg, ${bgColor}1A 0%, ${bgColor}55 100%)`,
            backgroundColor: `${bgColor}12`,
            display:         showAI && aiState === 'success' ? 'none' : undefined,
          }}
        >
          <div className="w-44 h-36">
            <BraSVG spec={spec}/>
          </div>

          {color && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full border border-lm shrink-0"
                style={{ background: bgColor }}
              />
              <span
                className="font-sans text-[0.62rem] tracking-label uppercase"
                style={{ color: isDark ? bgColor : '#6B6058' }}
              >
                {selectedColor?.label ?? color}
              </span>
            </div>
          )}

          {/* AI loading skeleton overlay */}
          {aiState === 'loading' && (
            <div className="absolute inset-0 rounded-card flex flex-col items-center justify-center gap-3"
                 style={{ background: 'rgba(248,246,243,0.85)', backdropFilter: 'blur(6px)' }}>
              <div className="w-8 h-8 rounded-full border-2 border-lm border-t-mauve animate-spin"/>
              <p className="font-sans text-[0.7rem] text-mauve tracking-wide">
                Generating your preview…
              </p>
              <p className="font-sans text-[0.62rem] text-mauve opacity-60">
                This can take 20–40 seconds
              </p>
            </div>
          )}
        </div>

        {/* AI image — shown on success when toggled on */}
        {showAI && aiState === 'success' && aiUrl && (
          <div className="relative rounded-card overflow-hidden min-h-[260px]">
            <Image
              src={aiUrl}
              alt={`AI preview of custom ${braType ?? 'bra'}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
            {/* Back to SVG button */}
            <button
              onClick={() => setShowAI(false)}
              className="absolute top-2 right-2 font-sans text-[0.6rem] tracking-label uppercase px-2 py-1"
              style={{
                borderRadius: 2,
                background:   'rgba(248,246,243,0.9)',
                color:        '#6B6058',
                backdropFilter: 'blur(4px)',
              }}
            >
              SVG view
            </button>
            {/* Disclaimer */}
            <div
              className="absolute bottom-0 inset-x-0 px-3 py-2"
              style={{ background: 'rgba(15,13,11,0.55)' }}
            >
              <p className="font-sans text-[0.58rem] text-blush opacity-80 text-center">
                Preview is representative; final fit and finish may vary.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── AI action button / status ─────────────────────── */}
      {canGenerate && (
        <div className="space-y-1.5">
          {aiState === 'idle' && (
            <button
              onClick={handleGenerateAI}
              className="w-full flex items-center justify-center gap-2 h-9 font-sans text-[0.72rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
              style={{ borderRadius: 3 }}
            >
              <Sparkles className="w-3.5 h-3.5"/>
              Generate AI Preview
            </button>
          )}

          {aiState === 'loading' && (
            <div className="w-full flex items-center justify-center gap-2 h-9 font-sans text-[0.72rem] tracking-btn uppercase text-mauve opacity-60">
              <div className="w-3.5 h-3.5 rounded-full border border-mauve border-t-transparent animate-spin"/>
              Generating…
            </div>
          )}

          {aiState === 'success' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAI(!showAI)}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 font-sans text-[0.72rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                style={{ borderRadius: 3 }}
              >
                <Sparkles className="w-3.5 h-3.5"/>
                {showAI ? 'Diagram view' : 'AI preview'}
              </button>
              <button
                onClick={handleGenerateAI}
                title="Regenerate"
                className="w-9 h-9 flex items-center justify-center border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                style={{ borderRadius: 3 }}
              >
                <RefreshCw className="w-3.5 h-3.5"/>
              </button>
            </div>
          )}

          {(aiState === 'error' || aiState === 'unavailable') && (
            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5 px-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-mauve shrink-0 mt-px"/>
                <p className="font-sans text-[0.65rem] text-mauve leading-snug">{aiError}</p>
              </div>
              {aiState === 'error' && (
                <button
                  onClick={handleGenerateAI}
                  className="w-full flex items-center justify-center gap-2 h-9 font-sans text-[0.72rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                  style={{ borderRadius: 3 }}
                >
                  <RefreshCw className="w-3.5 h-3.5"/>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Spec summary ─────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">
            Custom Bra
          </span>
          <span className="font-serif text-[1.1rem] font-light text-deep">
            {formatPrice(price)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-lm">
          {[
            { label: 'Size',    value: size },
            { label: 'Type',    value: braType ?? '—' },
            { label: 'Fabric',  value: fabric  ?? '—' },
            { label: 'Colour',  value: selectedColor?.label ?? '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans text-[0.58rem] tracking-label uppercase text-mauve">{label}</p>
              <p className="font-sans text-[0.72rem] capitalize text-deep mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step progress dots ───────────────────────────── */}
      <div className="flex justify-center gap-1.5">
        {STEP_LABELS.map((_, i) => (
          <span
            key={i}
            className="block transition-all duration-200"
            style={{
              width:        i + 1 === currentStep ? 16 : 6,
              height:       4,
              borderRadius: 2,
              background:   i + 1 <= currentStep ? '#0F0D0B' : '#D8D4CE',
            }}
          />
        ))}
      </div>
    </div>
  )
}
