'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useBuilderStore } from '@/store/builderStore'
import { BraSVG } from './BraSVG'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'
import { formatPrice } from '@/lib/utils'
import {
  CB_BRA_TYPES,
  CB_CLOSURE_OPTIONS,
  CB_COLOR_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_PADDING_OPTIONS,
  CB_STRAP_STYLES,
  CB_SUPPORT_OPTIONS,
  CB_UNDERWIRE_OPTIONS,
} from '@/data/builderOptions'
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'

const STEP_LABELS = ['Size', 'Type', 'Style', 'Fabric', 'Review']
const EMPTY_VALUE = '—'

function optionLabel(options: readonly { id: string; label: string }[], id: string | null) {
  return options.find((option) => option.id === id)?.label ?? EMPTY_VALUE
}

interface ProductPreviewProps {
  currentStep: number
}

type AIState = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

export function ProductPreview({ currentStep }: ProductPreviewProps) {
  const store = useBuilderStore()
  const {
    braType,
    color,
    fabric,
    band,
    cup,
    price,
    strapStyle,
    padding,
    underwire,
    closure,
    support,
  } = store

  const spec             = buildVisualSpec(store)
  const selectedColor    = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const bgColor          = selectedColor?.color ?? '#EDE9E4'
  const isDark           = ['deep', 'black', 'slate', 'mauve', 'navy', 'forest', 'burgundy', 'cobalt', 'red', 'teal', 'olive', 'plum', 'terracotta', 'chocolate'].includes(color ?? '')
  const size             = band && cup ? `${band}${cup}` : EMPTY_VALUE
  const braTypeLabel     = optionLabel(CB_BRA_TYPES, braType)
  const fabricLabel      = optionLabel(CB_FABRIC_OPTIONS, fabric)
  const strapLabel       = braType === 'strapless' ? 'No straps' : optionLabel(CB_STRAP_STYLES, strapStyle)
  const primaryDetails   = [
    { label: 'Size',   value: size },
    { label: 'Type',   value: braTypeLabel },
    { label: 'Fabric', value: fabricLabel },
    { label: 'Colour', value: selectedColor?.label ?? EMPTY_VALUE },
  ]
  const articleDetails = [
    { label: 'Straps',    value: strapLabel },
    { label: 'Padding',   value: optionLabel(CB_PADDING_OPTIONS, padding) },
    { label: 'Underwire', value: optionLabel(CB_UNDERWIRE_OPTIONS, underwire) },
    { label: 'Closure',   value: optionLabel(CB_CLOSURE_OPTIONS, closure) },
    { label: 'Support',   value: optionLabel(CB_SUPPORT_OPTIONS, support) },
  ]

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
    <div className="flex flex-col h-full gap-1.5">

      {/* ── Preview area ─────────────────────────────────── */}
      <div className="relative">
        {/* SVG preview — always rendered, hidden when AI image is shown */}
        <div
          className="rounded-card flex flex-col items-center justify-center p-2 transition-colors duration-500 h-[clamp(145px,22vh,220px)]"
          style={{
            background:      `linear-gradient(160deg, ${bgColor}1A 0%, ${bgColor}55 100%)`,
            backgroundColor: `${bgColor}12`,
            display:         showAI && aiState === 'success' ? 'none' : undefined,
          }}
        >
          <div className="w-36 h-24 lg:w-40 lg:h-28 2xl:w-44 2xl:h-32">
            <BraSVG spec={spec}/>
          </div>

          {color && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border border-lm shrink-0"
                style={{ background: bgColor }}
              />
              <span
                className="font-sans text-[0.52rem] lg:text-[0.58rem] tracking-label uppercase"
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
              <p className="font-sans text-[0.7rem] lg:text-[0.76rem] text-mauve tracking-wide">
                Generating your preview…
              </p>
              <p className="font-sans text-[0.62rem] lg:text-[0.68rem] text-mauve opacity-60">
                This can take 20–40 seconds
              </p>
            </div>
          )}
        </div>

        {/* AI image — shown on success when toggled on */}
        {showAI && aiState === 'success' && aiUrl && (
          <div className="relative rounded-card overflow-hidden h-[clamp(145px,22vh,220px)]">
            <Image
              src={aiUrl}
              alt={`AI preview of custom ${braTypeLabel !== EMPTY_VALUE ? braTypeLabel : 'bra'} in ${selectedColor?.label ?? 'selected colour'}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 400px, (max-width: 1536px) 500px, 600px"
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

      {/* ── AI action button / status — compact */}
      {canGenerate && (
        <div className="space-y-1">
          {aiState === 'idle' && (
            <button
              onClick={handleGenerateAI}
              className="w-full flex items-center justify-center gap-1.5 h-7 font-sans text-[0.62rem] lg:text-[0.68rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
              style={{ borderRadius: 3 }}
            >
              <Sparkles className="w-3 h-3"/>
              Generate AI Preview
            </button>
          )}

          {aiState === 'loading' && (
            <div className="w-full flex items-center justify-center gap-1.5 h-7 font-sans text-[0.62rem] lg:text-[0.68rem] tracking-btn uppercase text-mauve opacity-60">
              <div className="w-3 h-3 rounded-full border border-mauve border-t-transparent animate-spin"/>
              Generating…
            </div>
          )}

          {aiState === 'success' && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowAI(!showAI)}
                className="flex-1 flex items-center justify-center gap-1 h-7 font-sans text-[0.62rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                style={{ borderRadius: 3 }}
              >
                <Sparkles className="w-3 h-3"/>
                {showAI ? 'Diagram' : 'AI preview'}
              </button>
              <button
                onClick={handleGenerateAI}
                title="Regenerate"
                className="w-7 h-7 flex items-center justify-center border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                style={{ borderRadius: 3 }}
              >
                <RefreshCw className="w-3 h-3"/>
              </button>
            </div>
          )}

          {(aiState === 'error' || aiState === 'unavailable') && (
            <div className="space-y-1">
              <div className="flex items-start gap-1 px-0.5">
                <AlertCircle className="w-3 h-3 text-mauve shrink-0 mt-px"/>
                <p className="font-sans text-[0.55rem] lg:text-[0.6rem] text-mauve leading-snug">{aiError}</p>
              </div>
              {aiState === 'error' && (
                <button
                  onClick={handleGenerateAI}
                  className="w-full flex items-center justify-center gap-1 h-7 font-sans text-[0.62rem] lg:text-[0.68rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all duration-200"
                  style={{ borderRadius: 3 }}
                >
                  <RefreshCw className="w-3 h-3"/>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Spec summary ─────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[0.58rem] lg:text-[0.64rem] tracking-label uppercase text-mauve">
            Custom Bra
          </span>
          <span className="font-serif text-[clamp(0.95rem,1vw,1.2rem)] font-light text-deep">
            {formatPrice(price)}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-x-1.5 gap-y-0.5 pt-1 border-t border-lm">
          {primaryDetails.map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans text-[0.5rem] tracking-label uppercase text-mauve">{label}</p>
              <p className="font-sans text-[0.62rem] lg:text-[0.68rem] text-deep mt-px">{value}</p>
            </div>
          ))}
        </div>

        <div className="pt-1 border-t border-lm">
          <p className="font-sans text-[0.5rem] tracking-label uppercase text-mauve">
            Details
          </p>
          <div className="grid grid-cols-3 gap-x-1.5 gap-y-px mt-0.5">
            {articleDetails.map(({ label, value }) => (
              <div key={label}>
                <p className="font-sans text-[0.48rem] tracking-label uppercase text-mauve opacity-75">{label}</p>
                <p className="font-sans text-[0.56rem] lg:text-[0.62rem] text-deep truncate" title={value}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step progress dots — ultra compact */}
      <div className="flex justify-center gap-1 pt-0.5">
        {STEP_LABELS.map((_, i) => (
          <span
            key={i}
            className="block transition-all duration-200"
            style={{
              width:        i + 1 === currentStep ? 14 : 5,
              height:       3,
              borderRadius: 1.5,
              background:   i + 1 <= currentStep ? '#0F0D0B' : '#D8D4CE',
            }}
          />
        ))}
      </div>
    </div>
  )
}
