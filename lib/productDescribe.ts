import type { Product, ProductCategory, SupportLevel } from '@/types'
import { colorLabel } from '@/lib/colorways'

export type ShotKind = 'front' | 'back' | 'lifestyle' | 'detail'

const CAT_NOUN: Record<ProductCategory, string> = {
  everyday: 'everyday bra',
  pushup:   'push-up bra',
  lace:     'lace bra',
  sports:   'sports bra',
  seamless: 'seamless bra',
  plus:     'full-figure bra',
  bridal:   'bridal bra',
}

const SHOT_PHRASE: Record<ShotKind, string> = {
  front:     'front view',
  back:      'back view',
  lifestyle: 'worn',
  detail:    'detail',
}

export type DescribableProduct = Pick<
  Product,
  'name' | 'story' | 'fabric' | 'cat' | 'support' | 'sizes' | 'sub'
>

export function shotKindFromIndex(index: number): ShotKind {
  if (index === 0) return 'front'
  if (index === 1) return 'back'
  if (index === 2) return 'lifestyle'
  return 'detail'
}

export function categoryNoun(cat: ProductCategory): string {
  return CAT_NOUN[cat]
}

/** Full alt text for a product photograph. Recomputed from live fields. */
export function describeProductImage(
  product: DescribableProduct,
  opts: { shot?: ShotKind; colorLabel?: string | null } = {},
): string {
  const shot = SHOT_PHRASE[opts.shot ?? 'front']
  const colourRaw = opts.colorLabel?.trim()
  const colour = colourRaw && colourRaw !== 'Colour' ? colourRaw : undefined
  const noun = CAT_NOUN[product.cat]
  const head = colour
    ? `${product.name} ${noun} in ${colour}, ${shot}`
    : `${product.name} ${noun}, ${shot}`

  return [
    `${head}.`,
    product.fabric ? `${product.fabric}.` : '',
    `${product.support} support.`,
    `Sizes ${product.sizes}.`,
    product.story,
  ]
    .filter(Boolean)
    .join(' ')
}

/** Compact alt for cards, thumbs, and bag lines. */
export function describeProductShort(
  product: Pick<Product, 'name' | 'cat'>,
  opts: { shot?: ShotKind; colorLabel?: string | null } = {},
): string {
  const colourRaw = opts.colorLabel?.trim()
  const colour = colourRaw && colourRaw !== 'Colour' ? colourRaw : undefined
  const shot = opts.shot ? SHOT_PHRASE[opts.shot] : null
  return [product.name, colour, CAT_NOUN[product.cat], shot].filter(Boolean).join(' · ')
}

export function describeProductSeo(product: DescribableProduct): string {
  return [
    product.story,
    product.sub ? `${product.sub}.` : '',
    `${product.fabric}. ${product.support} support. Sizes ${product.sizes}.`,
    'VELURA — crafted for the woman who knows.',
  ]
    .filter(Boolean)
    .join(' ')
}

export function describeCartLine(item: {
  name: string
  size: string
  colorLabel?: string
  isCustom?: boolean
}): string {
  if (item.isCustom) {
    return [item.name, 'custom bra', item.colorLabel, `size ${item.size}`]
      .filter(Boolean)
      .join(' · ')
  }
  return [item.name, item.colorLabel, `size ${item.size}`].filter(Boolean).join(' · ')
}

export function galleryAlts(
  product: DescribableProduct,
  imageCount: number,
  colorHex?: string | null,
): string[] {
  const colour = colorHex ? colorLabel(colorHex) : null
  return Array.from({ length: imageCount }, (_, i) =>
    describeProductImage(product, { shot: shotKindFromIndex(i), colorLabel: colour }),
  )
}

export function supportCopy(level: SupportLevel): string {
  if (level === 'Light') return 'Light support'
  if (level === 'High') return 'High support'
  return 'Medium support'
}
