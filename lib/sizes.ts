const BANDS = [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52]
const CUPS = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'F', 'G', 'H']
const APPAREL = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']

export function parseSizeRange(range: string): string[] {
  const sizes: string[] = []
  const [startStr, endStr] = range.split('–').map((part) => part.trim())
  if (!startStr || !endStr) return sizes

  const apparelStart = APPAREL.indexOf(startStr)
  const apparelEnd = APPAREL.indexOf(endStr)
  if (apparelStart !== -1 && apparelEnd >= apparelStart) {
    return APPAREL.slice(apparelStart, apparelEnd + 1)
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
