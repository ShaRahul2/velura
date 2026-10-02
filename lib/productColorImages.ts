import type { Product } from '@/types'
import { pantyImages } from '@/lib/pantyImages'

const SLUG: Record<number, string> = {
  1: 'feathersoft', 2: 'morningdew', 3: 'nudesense', 4: 'velvetplunge',
  5: 'goldenhour', 6: 'floralluxe', 7: 'silkdream', 8: 'armorx',
  9: 'zenflow', 10: 'cloudlift', 11: 'bareease', 12: 'curvelove',
  13: 'softcurve', 14: 'ivorybloom', 15: 'moonlitrose', 16: 'linenhour',
  17: 'quietknit', 18: 'dayveil', 19: 'nightcontour', 20: 'lowcut',
  21: 'afterdark', 22: 'whispernet', 23: 'pacehold', 24: 'studioline',
  25: 'secondskin', 26: 'edgenone', 27: 'fullframe', 28: 'widerest',
  29: 'pearlgown', 30: 'firstlight', 31: 'paleshift', 32: 'knitline',
  33: 'softrise', 34: 'nethour', 35: 'holdfast', 36: 'airbound',
  37: 'strapease', 38: 'veilcup', 39: 'smokeknit', 40: 'redhour',
  41: 'mossline', 42: 'inklace',
  43: 'feathersoft-hipster', 44: 'secondskin-bikini', 45: 'floralluxe-thong',
  46: 'velvetplunge-brief', 47: 'curvelove-highwaist', 48: 'quietknit-boyshort',
  49: 'dayveil-bikini', 50: 'afterdark-thong',
}

export function colorVariantSrc(productId: number, hex: string, angle = 1): string {
  const slug = SLUG[productId] ?? 'feathersoft'
  const key = hex.replace('#', '').toLowerCase()
  if (angle <= 1) return `/images/products/variants/${slug}-${key}.jpg`
  return `/images/products/variants/${slug}-${key}-${angle}.jpg`
}

function unique(urls: string[]): string[] {
  const seen = new Set<string>()
  return urls.filter((url) => {
    if (!url || seen.has(url)) return false
    seen.add(url)
    return true
  })
}

/** Extra still-life angles that exist on disk for a given `{slug}-{hex}`. */
const EXTRA_ANGLES: Record<string, number> = {
  'morningdew-f0ebe0': 2,
  'morningdew-9caf88': 2,
}

export function imagesForColor(product: Product, colorIndex: number): string[] {
  const hex = product.colorways?.[colorIndex]
  if (!hex || colorIndex === 0) return unique(product.images)

  const slug = SLUG[product.id] ?? 'feathersoft'
  if (product.cat === 'panties' && SLUG[product.id]) return pantyImages(slug, hex)
  const key = `${slug}-${hex.replace('#', '').toLowerCase()}`
  const count = EXTRA_ANGLES[key] ?? 1
  const images: string[] = []
  for (let angle = 1; angle <= count; angle++) {
    images.push(colorVariantSrc(product.id, hex, angle))
  }
  return images
}
