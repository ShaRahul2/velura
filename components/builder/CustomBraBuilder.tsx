'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { StepBar } from './StepBar'
import { Step1Size } from './Step1Size'
import { Step2BraType } from './Step2BraType'
import { Step3Style } from './Step3Style'
import { Step4FabricColor } from './Step4FabricColor'
import { Step5Review } from './Step5Review'
import { ProductPreview } from './ProductPreview'
import { formatPrice } from '@/lib/utils'

const STEPS = 5

function canProceed(step: number, store: ReturnType<typeof useBuilderStore.getState>): boolean {
  if (step === 1) return !!(store.band && store.cup)
  if (step === 2) return !!store.braType
  if (step === 3) return !!(store.strapStyle && store.padding && store.underwire && store.closure && store.support)
  if (step === 4) return !!(store.fabric && store.color)
  return true
}

export function CustomBraBuilder() {
  const [step, setStep] = useState(1)
  const store = useBuilderStore()           // reactive — re-renders on every selection
  const ready = canProceed(step, store)
  const price = store.price

  function next() { if (step < STEPS) setStep(step + 1) }
  function goTo(newStep: number) {
    if (newStep >= 1 && newStep <= STEPS) setStep(newStep)
  }
  function resetAll() {
    store.reset()
    setStep(1)
  }

  return (
    <section className="builder-shell h-[calc(100svh-4rem)] min-h-[540px] flex flex-col bg-cream overflow-hidden">
      {/* Header — compact */}
      <div className="border-b border-lm py-1.5 lg:py-2 px-5 md:px-10 shrink-0">
        <div className="flex items-center justify-between max-w-6xl xl:max-w-7xl mx-auto">
          <div className="text-center flex-1">
            <p className="font-sans text-[0.56rem] tracking-label uppercase text-rose mb-px">
              Custom Bra Builder
            </p>
            <h1
              className="font-serif font-light text-deep leading-none"
              style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.6rem)', letterSpacing: '-0.01em' }}
            >
              Built for your body.
            </h1>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="font-sans text-[0.58rem] lg:text-[0.62rem] text-mauve hidden sm:block">Total</div>
            <div className="font-serif text-[1.05rem] lg:text-[1.15rem] font-light text-deep tabular-nums">{formatPrice(price)}</div>
            <button
              onClick={resetAll}
              className="font-sans text-[0.58rem] lg:text-[0.62rem] tracking-btn uppercase text-mauve hover:text-deep border border-lm px-2 py-0.5 rounded-[2px] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Body — fills remaining viewport height */}
      <div className="flex-1 min-h-0 overflow-hidden max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-5 md:px-6 py-1.5 lg:py-2 flex flex-col">
        <StepBar current={step} onStepClick={goTo} />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)] 2xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1fr)] gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 flex-1 min-h-0 overflow-hidden">
          {/* Left — every step is sized to remain visible as a whole */}
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              {step === 1 && <Step1Size />}
              {step === 2 && <Step2BraType />}
              {step === 3 && <Step3Style />}
              {step === 4 && <Step4FabricColor />}
              {step === 5 && <Step5Review />}
            </div>

            {/* Navigation — pinned at bottom of left column */}
            <div className="flex gap-2 pt-1.5 shrink-0">
              {step > 1 && (
                <button
                  onClick={() => goTo(step - 1)}
                  className="h-8 px-4 font-sans text-[0.66rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
                  style={{ borderRadius: 3 }}
                >
                  Back
                </button>
              )}
              {step < STEPS ? (
                <button
                  onClick={next}
                  disabled={!ready}
                  className="flex-1 h-8 font-sans text-[0.66rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-35 hover:tracking-wide transition-all duration-200"
                  style={{ borderRadius: 3 }}
                >
                  {step === 4 ? 'Review' : 'Continue'}
                </button>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>

          {/* Right — live preview, fills height */}
          <div className="hidden md:flex flex-col overflow-hidden">
            <div
              className="flex-1 min-h-0 overflow-hidden p-2 lg:p-2.5 2xl:p-3"
              style={{ borderRadius: 4, border: '1px solid #D8D4CE', background: '#FDFBF9' }}
            >
              <ProductPreview currentStep={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
