'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'

const BANDS = ['26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52']
const CUPS  = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H', 'I', 'J', 'K']

export function Step1Size() {
  const { sizeMode, band, cup, fitUnit, setSizeMode, setBand, setCup, setFitUnit } = useBuilderStore()

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
        setSizeMode('standard')  // switch to pills view so selection is visible
      }
    } catch {
      // noop
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-serif text-[1.1rem] lg:text-[1.2rem] font-light text-deep mb-px">Choose your size</h3>
      <p className="font-sans text-[0.65rem] text-mauve mb-2">Inclusive sizing 26AA–52K. Or use the calculator.</p>

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-2">
        {(['standard', 'fit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setSizeMode(mode)}
            className="h-7 px-3 font-sans text-[0.6rem] tracking-btn uppercase transition-all duration-200"
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
        <div className="space-y-2">
          {/* Band */}
          <div>
            <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve mb-1">Band</p>
            <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-7 lg:grid-cols-8 gap-1">
              {BANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBand(b)}
                  className="w-full h-6 lg:h-7 font-sans text-[0.66rem] transition-all duration-150"
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
            <p className="font-sans text-[0.55rem] tracking-label uppercase text-mauve mb-1">Cup</p>
            <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-7 lg:grid-cols-9 gap-1">
              {CUPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCup(c)}
                  className="w-full h-6 lg:h-7 font-sans text-[0.66rem] transition-all duration-150"
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
        <div className="space-y-2 max-w-sm">
          {/* Fit unit */}
          <div className="flex gap-1.5 mb-1">
            {(['cm', 'in'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setFitUnit(u)}
                className="h-6 px-2.5 font-sans text-[0.58rem] tracking-btn uppercase"
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-sans text-[0.55rem] tracking-label uppercase text-mauve block mb-0.5">
                Bust ({fitUnit})
              </label>
              <input
                type="number"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                placeholder={fitUnit === 'cm' ? '88' : '35'}
                className="w-full h-7 px-2 font-sans text-[0.75rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
                style={{ borderRadius: 3 }}
              />
            </div>
            <div>
              <label className="font-sans text-[0.55rem] tracking-label uppercase text-mauve block mb-0.5">
                Underbust ({fitUnit})
              </label>
              <input
                type="number"
                value={underbust}
                onChange={(e) => setUnderbust(e.target.value)}
                placeholder={fitUnit === 'cm' ? '76' : '30'}
                className="w-full h-7 px-2 font-sans text-[0.75rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors"
                style={{ borderRadius: 3 }}
              />
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={loading || !bust || !underbust}
            className="h-7 px-4 font-sans text-[0.62rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-40 transition-all"
            style={{ borderRadius: 3 }}
          >
            {loading ? 'Calculating…' : 'Calculate My Size'}
          </button>

          {fitResult && (
            <div
              className="px-3 py-1.5"
              style={{ background: 'rgba(15,13,11,0.04)', borderRadius: 3, border: '1px solid #D8D4CE' }}
            >
              <p className="font-sans text-[0.52rem] tracking-label uppercase text-mauve">Recommended</p>
              <p className="font-serif text-[1.35rem] font-light text-deep leading-none">{fitResult}</p>
              <p className="font-sans text-[0.58rem] text-mauve">Band {band} · Cup {cup}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
