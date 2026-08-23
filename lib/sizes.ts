const BANDS = [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52]
const CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H']

export function parseSizeRange(range: string): string[] {
  const sizes: string[] = []
  const [startStr, endStr] = range.split('–')
  if (!startStr || !endStr) return sizes
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
