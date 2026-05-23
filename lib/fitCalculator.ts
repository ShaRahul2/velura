import type { FitCalculatorInput, FitCalculatorResult } from '@/types'

const cupThresholds = [
  { maxDiff: 2, cup: 'AA' },
  { maxDiff: 4, cup: 'A' },
  { maxDiff: 6, cup: 'B' },
  { maxDiff: 8, cup: 'C' },
  { maxDiff: 10, cup: 'D' },
  { maxDiff: 12, cup: 'DD' },
  { maxDiff: 14, cup: 'DDD' },
]

function toCm(value: number, unit: 'cm' | 'in') {
  return unit === 'in' ? value * 2.54 : value
}

function normalizeBand(underbustCm: number) {
  const rounded = Math.ceil(underbustCm)
  const even = rounded % 2 === 0 ? rounded : rounded + 1
  return Math.min(Math.max(even, 28), 44)
}

function getCup(diffCm: number) {
  const matched = cupThresholds.find((threshold) => diffCm < threshold.maxDiff)
  return matched ? matched.cup : 'G'
}

function getConfidence(bustCm: number, underbustCm: number) {
  const diff = bustCm - underbustCm
  if (diff < 4 || diff > 16) {
    return 'medium' as const
  }
  return 'high' as const
}

export function calculateFit({ bust, underbust, unit }: FitCalculatorInput): FitCalculatorResult {
  const bustCm = toCm(bust, unit)
  const underbustCm = toCm(underbust, unit)
  const band = normalizeBand(underbustCm)
  const diff = Math.max(0, bustCm - underbustCm)
  const cup = getCup(diff)
  const size = `${band}${cup}`
  const confidence = getConfidence(bustCm, underbustCm)

  return {
    band: String(band),
    cup,
    size,
    confidence,
  }
}
