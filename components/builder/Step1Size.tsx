'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'

const BANDS = ['28', '30', '32', '34', '36', '38', '40', '42', '44']
const CUPS  = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G']

export function Step1Size() {
  const { sizeMode, band, cup, fitUnit, setSizeMode, setBand, setCup } = useBuilderStore()

  const [bust, setBust]           = useState('')
  const [underbust, setUnderbust] = useState('')
  const [fitResult, setFitResult] = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)

  async function calculate() {
    if (!bust || !underbust) return
    setLoading(true)
    try {
      const res  = await fetch('/api/fit-calculator', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ bust: Number(bust), underbust: Number(underbust), unit: fitUnit }),
      })
      const data = await res.json()
      if (data.data) {
        setBand(data.data.band)
        setCup(data.data.cup)
        setFitResult(data.data.size)
      }
    } catch {
      // noop
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-serif text-[1.5rem] font-light text-deep mb-1">Choose your size</h3>
      <p className="font-sans text-[0.82rem] text-mauve mb-6">Select your band and cup size, or use our fit calculator.</p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {(['standard', 'fit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setSizeMode(mode)}
            className="h-8 px-4 font-sans text-[0.7rem] tracking-btn uppercase transition-all duration-200"
            style={{
              borderRadius: 3,
              background: sizeMode === mode ? '#0F0D0B' : 'transparent',
              color:       sizeMode === mode ? '#EDE9E4' : '#6B6058',
              border:      sizeMode === mode ? 'none'   : '1px solid #D8D4CE',
            }}
          >
            {mode === 'standard' ? 'Standard' : 'Fit Calculator'}
          </button>
        ))}
      </div>

      {sizeMode === 'standard' ? (
        <div className="space-y-5">
          {/* Band */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-2">Band size</p>
            <div className="flex flex-wrap gap-2">
              {BANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBand(b)}
                  className="w-12 h-10 font-sans text-[0.8rem] transition-all duration-150"
                  style={{
                    borderRadius: 50,
                    background: band === b ? '#0F0D0B' : 'transparent',
                    color:       band === b ? '#EDE9E4' : '#0F0D0B',
                    border:      band === b ? 'none'   : '1px solid #D8D4CE',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Cup */}
          <div>
            <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-2">Cup size</p>
            <div className="flex flex-wrap gap-2">
              {CUPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCup(c)}
                  className="w-12 h-10 font-sans text-[0.8rem] transition-all duration-150"
                  style={{
                    borderRadius: 50,
                    background: cup === c ? '#0F0D0B' : 'transparent',
                    color:       cup === c ? '#EDE9E4' : '#0F0D0B',
                    border:      cup === c ? 'none'   : '1px solid #D8D4CE',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-xs">
          {/* Fit unit */}
          <div className="flex gap-2 mb-2">
            {(['cm', 'in'] as const).map((u) => (
              <button
                key={u}
                onClick={() => useBuilderStore.getState().setSizeMode('fit')}
                className="h-7 px-3 font-sans text-[0.65rem] tracking-btn uppercase"
                style={{
                  borderRadius: 3,
                  background: fitUnit === u ? '#0F0D0B' : 'transparent',
                  color:       fitUnit === u ? '#EDE9E4' : '#6B6058',
                  border:      `1px solid ${fitUnit === u ? '#0F0D0B' : '#D8D4CE'}`,
                }}
              >
                {u}
              </button>
            ))}
          </div>

          <div>
            <label className="font-sans text-[0.65rem] tracking-label uppercase text-mauve block mb-1">
              Bust measurement ({fitUnit})
            </label>
            <input
              type="number"
              value={bust}
              onChange={(e) => setBust(e.target.value)}
              placeholder={fitUnit === 'cm' ? 'e.g. 88' : 'e.g. 35'}
              className="w-full h-10 px-3 font-sans text-[0.85rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
              style={{ borderRadius: 3 }}
            />
          </div>
          <div>
            <label className="font-sans text-[0.65rem] tracking-label uppercase text-mauve block mb-1">
              Underbust measurement ({fitUnit})
            </label>
            <input
              type="number"
              value={underbust}
              onChange={(e) => setUnderbust(e.target.value)}
              placeholder={fitUnit === 'cm' ? 'e.g. 76' : 'e.g. 30'}
              className="w-full h-10 px-3 font-sans text-[0.85rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
              style={{ borderRadius: 3 }}
            />
          </div>

          <button
            onClick={calculate}
            disabled={loading || !bust || !underbust}
            className="h-10 px-6 font-sans text-[0.75rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-40 transition-all"
            style={{ borderRadius: 3 }}
          >
            {loading ? 'Calculating…' : 'Calculate My Size'}
          </button>

          {fitResult && (
            <div
              className="p-4"
              style={{ background: 'rgba(15,13,11,0.04)', borderRadius: 3, border: '1px solid #D8D4CE' }}
            >
              <p className="font-sans text-[0.65rem] tracking-label uppercase text-mauve mb-1">
                Recommended size
              </p>
              <p className="font-serif text-[1.6rem] font-light text-deep">{fitResult}</p>
              <p className="font-sans text-[0.7rem] text-mauve mt-1">
                Band {band} · Cup {cup}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
