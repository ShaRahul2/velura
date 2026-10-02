const BANDS = [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52]
const CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H']

/** Letter sizing used by panties (waist/hip fit), smallest to largest. */
export const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'] as const

const LETTER_SET = new Set<string>(LETTER_SIZES)

export function isLetterSize(size: string): boolean {
  return LETTER_SET.has(size)
}

/** True when a display range like "XS–4XL" uses letter sizes rather than band/cup. */
export function isLetterRange(range: string): boolean {
  const [start] = range.split('–')
  return Boolean(start) && isLetterSize(start.trim())
}

export function parseSizeRange(range: string): string[] {
  const sizes: string[] = []
  const [startStr, endStr] = range.split('–')
  if (!startStr || !endStr) return sizes
  if (isLetterRange(range)) {
    const from = LETTER_SIZES.indexOf(startStr.trim() as (typeof LETTER_SIZES)[number])
    const to = LETTER_SIZES.indexOf(endStr.trim() as (typeof LETTER_SIZES)[number])
    if (from === -1 || to === -1 || to < from) return sizes
    return LETTER_SIZES.slice(from, to + 1)
  }
  const startBand = parseInt(startStr, 10)
  const startCup = startStr.replace(String(startBand), '')
  const endBand = parseInt(endStr, 10)
  const endCup = endStr.replace(String(endBand), '')

  let active = false
  for (const band of BANDS) {
    for (const cup of CUPS) {
      const key = `${band}${cup}`
      if (`${startBand}${startCup}` === key) active = true
      if (active) sizes.push(key)
      if (`${endBand}${endCup}` === key) return sizes
    }
  }
  return sizes
}
