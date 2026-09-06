'use client'

import { useState, useEffect, useRef } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { BraSVG } from './BraSVG'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'
import { formatPrice, cn } from '@/lib/utils'
import {
  CB_BRA_TYPES,
  CB_COLOR_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_STRAP_STYLES,
  CB_SUPPORT_OPTIONS,
  DARK_COLOR_IDS,
  optionLabel,
} from '@/data/builderOptions'
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react'

const STEP_LABELS = ['Size', 'Type', 'Style', 'Fabric', 'Review']
const EMPTY_VALUE = '—'

interface ProductPreviewProps {
  currentStep: number
  compact?: boolean
  fill?: boolean
}

type AIState = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

export function ProductPreview({ currentStep, compact = false, fill = false }: ProductPreviewProps) {
  const store = useBuilderStore()
  const {
    braType, color, fabric, band, cup, price,
    strapStyle, support,
    previewUrl, previewHash, setPreview,
  } = store

  const spec          = buildVisualSpec(store)
  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const bgColor       = selectedColor?.color ?? '#EDE9E4'
  const isDark        = DARK_COLOR_IDS.has(color ?? '')
  const size          = band && cup ? `${band}${cup}` : EMPTY_VALUE
  const braTypeLabel  = optionLabel(CB_BRA_TYPES, braType)
  const fabricLabel   = optionLabel(CB_FABRIC_OPTIONS, fabric)
  const strapLabel    = braType === 'strapless' ? 'No straps' : optionLabel(CB_STRAP_STYLES, strapStyle)

  const [loading, setLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [unavailable, setUnavailable] = useState(false)
  const [hidePhoto, setHidePhoto] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const currentHash = specToHash(spec)
  const aiUrl = previewHash === currentHash ? previewUrl : null
  const aiState: AIState = loading
    ? 'loading'
    : unavailable
      ? 'unavailable'
      : aiError && !aiUrl
        ? 'error'
        : aiUrl
          ? 'success'
          : 'idle'
  const showAI = Boolean(aiUrl) && !hidePhoto

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const canGenerate = currentStep >= 3 && !!braType && !!fabric && !!color

  async function handleGenerateAI(refresh = false) {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setAiError('')
    setUnavailable(false)
    setHidePhoto(false)
    try {
      const res = await fetch('/api/builder-preview/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ spec, refresh }),
        signal:  ac.signal,
      })
      const raw = await res.text()
      let obj: Record<string, unknown> = {}
      try {
        obj = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
      } catch {
        throw new Error(
          res.ok
            ? 'The preview came back empty.'
            : 'The preview took too long. Try again.'
        )
      }

      if (res.status === 503 && obj.code === 'NO_API_KEY') {
        setUnavailable(true)
        setAiError('AI preview is not yet enabled for this store.')
        return
      }
      if (res.status === 402 && obj.code === 'INSUFFICIENT_CREDITS') {
        setUnavailable(true)
        setAiError('AI preview needs billing setup. The live diagram shows your spec.')
        return
      }
      if (!res.ok) {
        throw new Error((obj.error as string) ?? 'Generation failed')
      }
      const url = obj.url as string
      if (!url) throw new Error('No image returned')
      setPreview(url, currentHash)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setAiError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      if (!ac.signal.aborted) setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        compact ? 'gap-2' : 'gap-3',
        fill && 'h-full w-full min-h-0'
      )}
      style={{
        borderRadius: 4,
        border: '1px solid #D8D4CE',
        background: '#FDFBF9',
        padding: compact ? 10 : 16,
      }}
    >
      <div className="relative">
        <div
          className={cn(
            'rounded-card flex flex-col items-center justify-center transition-colors duration-500',
            compact ? 'h-[148px] p-2' : fill ? 'flex-1 min-h-[220px] p-4' : 'h-[280px] p-4'
          )}
          style={{
            background: `linear-gradient(160deg, ${bgColor}18 0%, ${bgColor}50 100%)`,
            display: showAI && aiState === 'success' ? 'none' : undefined,
          }}
        >
          <div className={cn(compact ? 'w-32 h-20' : 'w-full max-w-[240px] h-36 xl:h-40')}>
            <BraSVG spec={spec} />
          </div>
          {color && !compact && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-lm shrink-0"
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
          {aiState === 'loading' && (
            <div
              className="absolute inset-0 rounded-card flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(248,246,243,0.88)', backdropFilter: 'blur(6px)' }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-lm border-t-mauve animate-spin" />
              <p className="font-sans text-[0.72rem] text-mauve">Rendering the garment. This can take a minute.</p>
            </div>
          )}
        </div>

        {showAI && aiState === 'success' && aiUrl && (
          <div className={cn('relative overflow-hidden rounded-card bg-blush', compact ? 'h-[148px]' : fill ? 'min-h-[220px] flex-1' : 'h-[280px]')}>
            {/* AI urls may be Cloudinary, Pollinations, or data URIs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aiUrl}
              alt={`Preview of custom ${braTypeLabel} in ${selectedColor?.label ?? 'selected colour'}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
            <button
              onClick={() => setHidePhoto(true)}
              className="absolute top-2 right-2 font-sans text-[0.6rem] tracking-label uppercase px-2 py-1"
              style={{ borderRadius: 2, background: 'rgba(248,246,243,0.92)', color: '#6B6058' }}
            >
              Diagram
            </button>
            <div className="absolute bottom-0 inset-x-0 px-3 py-2" style={{ background: 'rgba(15,13,11,0.55)' }}>
              <p className="font-sans text-[0.58rem] text-blush text-center">
                Representative preview. Final finish may vary.
              </p>
            </div>
          </div>
        )}
      </div>

      {canGenerate && (
        <div>
          {aiState === 'idle' && (
            <button
              type="button"
              onClick={() => handleGenerateAI(false)}
              className="pressable flex h-9 w-full items-center justify-center gap-1.5 rounded-btn border border-lm font-sans text-[0.68rem] tracking-btn uppercase text-mauve transition-colors hover:border-deep hover:text-deep"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Photoreal preview
            </button>
          )}
          {aiState === 'loading' && compact && (
            <p className="font-sans text-[0.62rem] text-mauve">Rendering the garment…</p>
          )}
          {aiState === 'success' && (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setHidePhoto((v) => !v)}
                className="pressable flex h-9 flex-1 items-center justify-center gap-1 rounded-btn border border-lm font-sans text-[0.68rem] tracking-btn uppercase text-mauve transition-colors hover:border-deep hover:text-deep"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {showAI ? 'Diagram' : 'Photo'}
              </button>
              <button
                type="button"
                onClick={() => handleGenerateAI(true)}
                title="Regenerate"
                aria-label="Regenerate preview"
                className="pressable flex h-9 w-9 items-center justify-center rounded-btn border border-lm text-mauve hover:border-deep"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
          {(aiState === 'error' || aiState === 'unavailable') && (
            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0 text-mauve" aria-hidden="true" />
                <p className="font-sans text-[0.62rem] leading-snug text-mauve">{aiError}</p>
              </div>
              {aiState === 'error' && (
                <button
                  type="button"
                  onClick={() => handleGenerateAI(true)}
                  className="pressable flex h-9 w-full items-center justify-center gap-1 rounded-btn border border-lm font-sans text-[0.68rem] tracking-btn uppercase text-mauve hover:border-deep"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!compact && (
        <>
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-sans text-[0.62rem] tracking-label uppercase text-mauve">Custom Bra</span>
              <span className="font-serif text-[1.35rem] font-light text-deep">{formatPrice(price)}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-lm">
              {[
                { label: 'Size',    value: size },
                { label: 'Type',    value: braTypeLabel },
                { label: 'Fabric',  value: fabricLabel },
                { label: 'Colour',  value: selectedColor?.label ?? EMPTY_VALUE },
                { label: 'Straps',  value: strapLabel },
                { label: 'Support', value: optionLabel(CB_SUPPORT_OPTIONS, support) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve">{label}</p>
                  <p className="font-sans text-[0.78rem] text-deep truncate" title={value}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-auto">
            {STEP_LABELS.map((_, i) => (
              <span
                key={i}
                className="block transition-all duration-200"
                style={{
                  width: i + 1 === currentStep ? 16 : 6,
                  height: 3,
                  borderRadius: 1.5,
                  background: i + 1 <= currentStep ? '#0F0D0B' : '#D8D4CE',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
