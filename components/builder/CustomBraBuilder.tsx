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
  const ready = canProceed(step, useBuilderStore.getState())

  function next() { if (step < STEPS) setStep(step + 1) }
  function prev() { if (step > 1)     setStep(step - 1) }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-lm py-10 px-6 md:px-16 text-center">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-2">
          Custom Bra Builder
        </p>
        <h1
          className="font-serif font-light text-deep"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.01em' }}
        >
          Built for your body.
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <StepBar current={step} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — step content */}
          <div>
            {step === 1 && <Step1Size />}
            {step === 2 && <Step2BraType />}
            {step === 3 && <Step3Style />}
            {step === 4 && <Step4FabricColor />}
            {step === 5 && <Step5Review />}

            {/* Navigation */}
            {step < STEPS && (
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    onClick={prev}
                    className="h-11 px-6 font-sans text-[0.78rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
                    style={{ borderRadius: 3 }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!ready}
                  className="flex-1 h-11 font-sans text-[0.78rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-35 hover:tracking-wide transition-all duration-200"
                  style={{ borderRadius: 3 }}
                >
                  {step === 4 ? 'Review' : 'Continue'}
                </button>
              </div>
            )}
          </div>

          {/* Right — live preview */}
          <div className="hidden md:block">
            <div
              className="sticky top-24 p-6"
              style={{ borderRadius: 4, border: '1px solid #D8D4CE', background: '#FDFBF9' }}
            >
              <ProductPreview currentStep={step} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
