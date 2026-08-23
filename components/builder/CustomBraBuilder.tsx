'use client'

import { useEffect, useRef, useState } from 'react'
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
  const store = useBuilderStore()
  const ready = canProceed(step, store)
  const price = store.price
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [step])

  function next() { if (step < STEPS) setStep(step + 1) }
  function goTo(newStep: number) {
    if (newStep >= 1 && newStep <= STEPS) setStep(newStep)
  }
  function resetAll() {
    store.reset()
    setStep(1)
  }

  return (
    <section className="builder-shell h-[calc(100svh-4rem)] w-full max-w-[100vw] overflow-hidden flex flex-col bg-cream">
      <header className="shrink-0 border-b border-lm px-4 md:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 max-w-[1400px] mx-auto">
          <div className="min-w-0">
            <p className="font-sans text-[0.58rem] tracking-label uppercase text-rose">
              Custom Bra Builder
            </p>
            <h1 className="font-serif font-light text-deep truncate text-[1.25rem] md:text-[1.45rem] leading-tight">
              Built for your body.
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve">Total</p>
              <p className="font-serif text-[1.15rem] font-light text-deep tabular-nums leading-none">
                {formatPrice(price)}
              </p>
            </div>
            <button
              onClick={resetAll}
              className="font-sans text-[0.62rem] tracking-btn uppercase text-mauve hover:text-deep border border-lm px-3 py-1.5 rounded-btn"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="shrink-0 px-4 md:px-8 pt-3 pb-1 max-w-[1400px] w-full mx-auto">
        <StepBar current={step} onStepClick={goTo} />
      </div>

      <div className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-4 md:px-8">
        <div className="h-full min-w-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] gap-4 lg:gap-6">
          <div
            ref={scroller}
            className="min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 py-2 pb-4"
          >
            {step >= 2 && (
              <div className="lg:hidden mb-3">
                <ProductPreview currentStep={step} compact />
              </div>
            )}
            {step === 1 && <Step1Size />}
            {step === 2 && <Step2BraType />}
            {step === 3 && <Step3Style />}
            {step === 4 && <Step4FabricColor />}
            {step === 5 && <Step5Review />}
          </div>

          <aside className="hidden lg:flex min-h-0 py-2">
            <ProductPreview currentStep={step} fill />
          </aside>
        </div>
      </div>

      <div className="shrink-0 border-t border-lm bg-cream px-4 md:px-8 py-3">
        <div className="max-w-[1400px] mx-auto">
        {!ready && (
          <p className="sm:hidden font-sans text-[0.62rem] text-mauve mb-2">
            {step === 1 && 'Select a band and cup to continue.'}
            {step === 2 && 'Select a silhouette to continue.'}
            {step === 3 && 'Finish the construction to continue.'}
            {step === 4 && 'Select a fabric and colour to continue.'}
          </p>
        )}
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => goTo(step - 1)}
              className="h-11 px-6 font-sans text-[0.76rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all rounded-btn"
            >
              Back
            </button>
          )}
          {step < STEPS ? (
            <div className="flex-1 lg:flex-none flex items-center gap-3 min-w-0">
              <button
                onClick={next}
                disabled={!ready}
                className="flex-1 lg:flex-none lg:min-w-[240px] h-11 font-sans text-[0.76rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-35 hover:tracking-wide transition-all rounded-btn"
              >
                {step === 4 ? 'Review' : 'Continue'}
              </button>
              {!ready && (
                <p className="hidden sm:block font-sans text-[0.68rem] text-mauve">
                  {step === 1 && 'Select a band and cup.'}
                  {step === 2 && 'Select a silhouette.'}
                  {step === 3 && 'Finish the construction.'}
                  {step === 4 && 'Select a fabric and colour.'}
                </p>
              )}
            </div>
          ) : (
            <p className="font-sans text-[0.72rem] text-mauve">
              {formatPrice(price)} · made to order · 7–10 days
            </p>
          )}
        </div>
        </div>
      </div>
    </section>
  )
}
