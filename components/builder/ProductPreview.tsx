'use client'

import { useState, useEffect, useRef } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { BraSVG } from './BraSVG'
import { buildVisualSpec, specToHash } from '@/lib/builderVisualSpec'
import { formatPrice, cn } from '@/lib/utils'
import {
  CB_BRA_TYPES,
  CB_CLOSURE_OPTIONS,
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
    strapStyle, padding, underwire, closure, support,
  } = store

  const spec          = buildVisualSpec(store)
  const selectedColor = CB_COLOR_OPTIONS.find((c) => c.id === color)
  const bgColor       = selectedColor?.color ?? '#EDE9E4'
  const isDark        = DARK_COLOR_IDS.has(color ?? '')
  const size          = band && cup ? `${band}${cup}` : EMPTY_VALUE
  const braTypeLabel  = optionLabel(CB_BRA_TYPES, braType)
  const fabricLabel   = optionLabel(CB_FABRIC_OPTIONS, fabric)
  const strapLabel    = braType === 'strapless' ? 'No straps' : optionLabel(CB_STRAP_STYLES, strapStyle)

  const [aiState, setAiState] = useState<AIState>('idle')
  const [aiUrl, setAiUrl]     = useState<string | null>(null)
  const [aiError, setAiError] = useState('')
  const [showAI, setShowAI]   = useState(false)

  const prevHashRef = useRef('')
  const currentHash = specToHash(spec)
  useEffect(() => {
    if (prevHashRef.current && prevHashRef.current !== currentHash) {
      setAiState('idle')
      setAiUrl(null)
      setShowAI(false)
    }
    prevHashRef.current = currentHash
  }, [currentHash])

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
        setAiError('AI preview needs billing setup. The live diagram shows your spec.')
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
            compact ? 'h-[120px] p-2' : fill ? 'flex-1 min-h-[180px] p-4' : 'h-[240px] p-4'
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
              <p className="font-sans text-[0.72rem] text-mauve">Rendering your preview…</p>
            </div>
          )}
        </div>

        {showAI && aiState === 'success' && aiUrl && (
          <div className={cn('relative rounded-card overflow-hidden', compact ? 'h-[120px]' : fill ? 'flex-1 min-h-[180px]' : 'h-[240px]')}>
            {/* AI urls may be Cloudinary, Pollinations, or data URIs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aiUrl}
              alt={`Preview of custom ${braTypeLabel} in ${selectedColor?.label ?? 'selected colour'}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button
              onClick={() => setShowAI(false)}
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

      {canGenerate && !compact && (
        <div>
          {aiState === 'idle' && (
            <button
              onClick={handleGenerateAI}
              className="w-full flex items-center justify-center gap-1.5 h-9 font-sans text-[0.68rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all rounded-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Photoreal preview
            </button>
          )}
          {aiState === 'success' && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowAI(!showAI)}
                className="flex-1 flex items-center justify-center gap-1 h-9 font-sans text-[0.68rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep hover:text-deep transition-all rounded-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showAI ? 'Diagram' : 'Photo'}
              </button>
              <button
                onClick={handleGenerateAI}
                title="Regenerate"
                className="w-9 h-9 flex items-center justify-center border border-lm text-mauve hover:border-deep rounded-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {(aiState === 'error' || aiState === 'unavailable') && (
            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-mauve shrink-0 mt-px" />
                <p className="font-sans text-[0.62rem] text-mauve leading-snug">{aiError}</p>
              </div>
              {aiState === 'error' && (
                <button
                  onClick={handleGenerateAI}
                  className="w-full flex items-center justify-center gap-1 h-9 font-sans text-[0.68rem] tracking-btn uppercase border border-lm text-mauve hover:border-deep rounded-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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
