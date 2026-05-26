import type { FitCalculatorInput, FitCalculatorResult } from '@/types'

// Cup thresholds — bust minus underbust difference in cm
const CUP_THRESHOLDS = [
  { maxDiff:  2, cup: 'AA' },
  { maxDiff:  4, cup: 'A'  },
  { maxDiff:  6, cup: 'B'  },
  { maxDiff:  8, cup: 'C'  },
  { maxDiff: 10, cup: 'D'  },
  { maxDiff: 12, cup: 'DD' },
  { maxDiff: 14, cup: 'DDD'},
  { maxDiff: 17, cup: 'F'  },
  { maxDiff: 20, cup: 'G'  },
  { maxDiff: 23, cup: 'H'  },
]

// US/Indian bra band sizes (inches × 2, even numbers 28–50)
const BAND_SIZES = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50]

function toCm(value: number, unit: 'cm' | 'in') {
  return unit === 'in' ? value * 2.54 : value
}

function toInches(valueCm: number) {
  return valueCm / 2.54
}

// Band is derived from underbust measurement converted to inches,
// then rounded to the nearest standard band size (28–50).
function normalizeBand(underbustCm: number): number {
  const underbustIn = toInches(underbustCm)
  // Standard rule: band = underbust rounded up to nearest even inch
  const rounded = Math.ceil(underbustIn)
  const even    = rounded % 2 === 0 ? rounded : rounded + 1
  // Clamp to supported range 28–50
  const clamped = Math.min(Math.max(even, BAND_SIZES[0]), BAND_SIZES[BAND_SIZES.length - 1])
  // Snap to nearest standard band
  return BAND_SIZES.reduce((prev, curr) =>
    Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev
  )
}

function getCup(diffCm: number): string {
  const matched = CUP_THRESHOLDS.find((t) => diffCm < t.maxDiff)
  return matched ? matched.cup : 'H'
}

function getConfidence(bustCm: number, underbustCm: number): 'high' | 'medium' {
  const diff = bustCm - underbustCm
  return diff < 4 || diff > 20 ? 'medium' : 'high'
}

export function calculateFit({ bust, underbust, unit }: FitCalculatorInput): FitCalculatorResult {
  const bustCm      = toCm(bust, unit)
  const underbustCm = toCm(underbust, unit)
  const band        = normalizeBand(underbustCm)
  const diff        = Math.max(0, bustCm - underbustCm)
  const cup         = getCup(diff)
  const confidence  = getConfidence(bustCm, underbustCm)

  return { band: String(band), cup, size: `${band}${cup}`, confidence }
}
