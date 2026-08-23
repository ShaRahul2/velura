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
      const data = await res.json() as { data?: { band: string; cup: string; size: string } }
      if (data.data) {
        setBand(data.data.band)
        setCup(data.data.cup)
        setFitResult(data.data.size)
        setSizeMode('standard')
      }
    } catch {
      // keep the calculator open
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-serif text-[1.2rem] font-light text-deep mb-0.5">Choose your size</h3>
      <p className="font-sans text-[0.75rem] text-mauve mb-3">26AA–52K. Or measure and we&apos;ll place you.</p>

      <div className="flex gap-2 mb-5">
        {(['standard', 'fit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setSizeMode(mode)}
            className="h-9 px-4 font-sans text-[0.72rem] tracking-btn uppercase transition-all duration-200 rounded-btn"
            style={{
              background: sizeMode === mode ? '#0F0D0B' : 'transparent',
              color:      sizeMode === mode ? '#EDE9E4' : '#6B6058',
              border:     sizeMode === mode ? '1px solid #0F0D0B' : '1px solid #D8D4CE',
            }}
          >
            {mode === 'standard' ? 'Standard' : 'Fit Calculator'}
          </button>
        ))}
      </div>

      {sizeMode === 'standard' ? (
        <div className="space-y-5">
          <div>
            <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-2">Band</p>
            <div className="flex flex-wrap gap-2">
              {BANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBand(b)}
                  className="h-9 min-w-[44px] px-3 font-sans text-[0.76rem] transition-all duration-150 rounded-pill"
                  style={{
                    background: band === b ? '#0F0D0B' : 'transparent',
                    color:      band === b ? '#EDE9E4' : '#0F0D0B',
                    border:     band === b ? '1px solid #0F0D0B' : '1px solid #D8D4CE',
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-sans text-[0.62rem] tracking-label uppercase text-mauve mb-2">Cup</p>
            <div className="flex flex-wrap gap-2">
              {CUPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCup(c)}
                  className="h-9 min-w-[44px] px-3 font-sans text-[0.76rem] transition-all duration-150 rounded-pill"
                  style={{
                    background: cup === c ? '#0F0D0B' : 'transparent',
                    color:      cup === c ? '#EDE9E4' : '#0F0D0B',
                    border:     cup === c ? '1px solid #0F0D0B' : '1px solid #D8D4CE',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div className="flex gap-2">
            {(['cm', 'in'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setFitUnit(u)}
                className="h-8 px-3 font-sans text-[0.68rem] tracking-btn uppercase rounded-btn"
                style={{
                  background: fitUnit === u ? '#0F0D0B' : 'transparent',
                  color:      fitUnit === u ? '#EDE9E4' : '#6B6058',
                  border:     `1px solid ${fitUnit === u ? '#0F0D0B' : '#D8D4CE'}`,
                }}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans text-[0.62rem] tracking-label uppercase text-mauve block mb-1">
                Bust ({fitUnit})
              </label>
              <input
                type="number"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                placeholder={fitUnit === 'cm' ? '88' : '35'}
                className="w-full h-10 px-3 font-sans text-[0.86rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none rounded-btn"
              />
            </div>
            <div>
              <label className="font-sans text-[0.62rem] tracking-label uppercase text-mauve block mb-1">
                Underbust ({fitUnit})
              </label>
              <input
                type="number"
                value={underbust}
                onChange={(e) => setUnderbust(e.target.value)}
                placeholder={fitUnit === 'cm' ? '76' : '30'}
                className="w-full h-10 px-3 font-sans text-[0.86rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none rounded-btn"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={loading || !bust || !underbust}
            className="h-10 px-5 font-sans text-[0.72rem] tracking-btn uppercase bg-deep text-blush disabled:opacity-40 rounded-btn"
          >
            {loading ? 'Calculating…' : 'Calculate My Size'}
          </button>

          {fitResult && (
            <div className="px-4 py-3" style={{ background: 'rgba(15,13,11,0.04)', borderRadius: 4, border: '1px solid #D8D4CE' }}>
              <p className="font-sans text-[0.58rem] tracking-label uppercase text-mauve">Recommended</p>
              <p className="font-serif text-[1.6rem] font-light text-deep leading-none mt-1">{fitResult}</p>
              <p className="font-sans text-[0.72rem] text-mauve mt-1">Band {band} · Cup {cup}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
