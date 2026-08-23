export const CB_BRA_TYPES = [
  { id: 'everyday',     label: 'Everyday',      price: 0,   description: 'Soft support for daily wear.' },
  { id: 'tshirt',       label: 'T-shirt',       price: 100, description: 'Invisible under close-fitting clothes.' },
  { id: 'balconette',   label: 'Balconette',    price: 150, description: 'Straight neckline. Gentle lift.' },
  { id: 'demi',         label: 'Demi',          price: 150, description: 'Half-cup. Open necklines.' },
  { id: 'plunge',       label: 'Plunge',        price: 200, description: 'Low centre for deep V necklines.' },
  { id: 'pushup',       label: 'Push-up',       price: 250, description: 'Contoured lift. Fuller shape.' },
  { id: 'padded',       label: 'Padded',        price: 200, description: 'Smooth cups. Fuller silhouette.' },
  { id: 'wirefree',     label: 'Wirefree',      price: 100, description: 'Easy comfort. Light structure.' },
  { id: 'bralette',     label: 'Bralette',      price: 0,   description: 'Unlined. Soft. Barely there.' },
  { id: 'triangle',     label: 'Triangle',      price: 50,  description: 'Minimal cups. Fine straps.' },
  { id: 'strapless',    label: 'Strapless',     price: 250, description: 'Clean lines for off-shoulder.' },
  { id: 'sports',       label: 'Sports',        price: 200, description: 'High support for movement.' },
  { id: 'racerback',    label: 'Racerback',     price: 150, description: 'Open back. Secure hold.' },
  { id: 'longline',     label: 'Longline',      price: 250, description: 'Extended band. Sculpted torso.' },
  { id: 'full',         label: 'Full coverage', price: 150, description: 'Maximum coverage. Smooth profile.' },
  { id: 'minimizer',    label: 'Minimizer',     price: 200, description: 'Broad panels. Reduced profile.' },
  { id: 'lace',         label: 'Lace',          price: 250, description: 'Delicate overlay. Scalloped edge.' },
  { id: 'bridal',       label: 'Bridal',        price: 300, description: 'For the morning of.' },
] as const

export const CB_STRAP_STYLES = [
  { id: 'classic',     label: 'Classic',      price: 0,   description: 'Straight, parallel straps.' },
  { id: 'adjustable',  label: 'Adjustable',   price: 0,   description: 'Sliding hardware. Fine-tune the sit.' },
  { id: 'wide',        label: 'Wide',         price: 100, description: 'Padded comfort. Less dig.' },
  { id: 'crossback',   label: 'Crossback',    price: 100, description: 'X at the back. Locks in place.' },
  { id: 'racerback',   label: 'Racerback',    price: 100, description: 'Meets at the spine.' },
  { id: 'halter',      label: 'Halter',       price: 100, description: 'Ties at the nape.' },
  { id: 'convertible', label: 'Convertible',  price: 150, description: 'Multiway clips. Wear it several ways.' },
] as const

export const CB_PADDING_OPTIONS = [
  { id: 'none',   label: 'None',   price: 0 },
  { id: 'light',  label: 'Light',  price: 150 },
  { id: 'medium', label: 'Medium', price: 200 },
  { id: 'high',   label: 'High',   price: 250 },
] as const

export const CB_UNDERWIRE_OPTIONS = [
  { id: 'wired',    label: 'Wired',    price: 0 },
  { id: 'wirefree', label: 'Wirefree', price: 100 },
] as const

export const CB_CLOSURE_OPTIONS = [
  { id: 'back',     label: 'Back hook',  price: 0 },
  { id: 'front',    label: 'Front hook', price: 50 },
  { id: 'pull-on',  label: 'Pull-on',    price: 0 },
] as const

export const CB_SUPPORT_OPTIONS = [
  { id: 'light',  label: 'Light',  price: 0 },
  { id: 'medium', label: 'Medium', price: 50 },
  { id: 'high',   label: 'High',   price: 100 },
] as const

export const CB_FABRIC_OPTIONS = [
  { id: 'cotton',     label: 'Cotton blend', price: 0,   description: 'Breathable. Soft. Everyday.' },
  { id: 'modal',      label: 'Modal',        price: 50,  description: 'Cool hand. Fine drape.' },
  { id: 'microfiber', label: 'Microfiber',   price: 100, description: 'Second-skin. Invisible under knits.' },
  { id: 'smooth',     label: 'Smooth knit',  price: 0,   description: 'Matte. Seamless edges.' },
  { id: 'mesh',       label: 'Air mesh',     price: 100, description: 'Sheer panels. Light hold.' },
  { id: 'lace',       label: 'Lace mesh',    price: 150, description: 'Floral overlay. Scalloped trim.' },
  { id: 'silk',       label: 'Silk stretch', price: 150, description: 'Liquid sheen. Evening.' },
  { id: 'satin',      label: 'Satin',        price: 150, description: 'Gloss cups. Quiet luxury.' },
  { id: 'velvet',     label: 'Velvet',       price: 200, description: 'Dense pile. After dark.' },
] as const

export type ColorGroup = 'Neutrals' | 'Pinks & Reds' | 'Blues & Greens' | 'Earth & Jewel'

export const CB_COLOR_OPTIONS: { id: string; label: string; color: string; group: ColorGroup }[] = [
  // Neutrals
  { id: 'ivory',      label: 'Ivory',        color: '#F5EFE6', group: 'Neutrals' },
  { id: 'bone',       label: 'Bone',         color: '#EFE6D8', group: 'Neutrals' },
  { id: 'blush',      label: 'Warm White',   color: '#F8F6F3', group: 'Neutrals' },
  { id: 'cream',      label: 'Warm Stone',   color: '#EDE9E4', group: 'Neutrals' },
  { id: 'sand',       label: 'Sand',         color: '#E8D9C8', group: 'Neutrals' },
  { id: 'nude',       label: 'Nude',         color: '#C9B4A0', group: 'Neutrals' },
  { id: 'camel',      label: 'Camel',        color: '#C4A574', group: 'Neutrals' },
  { id: 'champagne',  label: 'Champagne',    color: '#D8C4A0', group: 'Neutrals' },
  { id: 'rose',       label: 'Pearl',        color: '#B8A898', group: 'Neutrals' },
  { id: 'stone',      label: 'Stone',        color: '#B8AFA5', group: 'Neutrals' },
  { id: 'smoke',      label: 'Smoke',        color: '#9A8878', group: 'Neutrals' },
  { id: 'dove',       label: 'Dove',         color: '#8A8580', group: 'Neutrals' },
  { id: 'mauve',      label: 'Warm Grey',    color: '#6B6058', group: 'Neutrals' },
  { id: 'mocha',      label: 'Mocha',        color: '#6F5344', group: 'Neutrals' },
  { id: 'espresso',   label: 'Espresso',     color: '#3E2A22', group: 'Neutrals' },
  { id: 'slate',      label: 'Slate',        color: '#5A5550', group: 'Neutrals' },
  { id: 'charcoal',   label: 'Charcoal',     color: '#3C3835', group: 'Neutrals' },
  { id: 'graphite',   label: 'Graphite',     color: '#2A2826', group: 'Neutrals' },
  { id: 'deep',       label: 'Near Black',   color: '#0F0D0B', group: 'Neutrals' },
  { id: 'black',      label: 'Onyx',         color: '#181818', group: 'Neutrals' },

  // Pinks & Reds
  { id: 'powder',     label: 'Powder',       color: '#F3D5D8', group: 'Pinks & Reds' },
  { id: 'pink',       label: 'Baby Pink',    color: '#EDAFC0', group: 'Pinks & Reds' },
  { id: 'peach',      label: 'Peach',        color: '#F4C3A8', group: 'Pinks & Reds' },
  { id: 'blushrose',  label: 'Blush Rose',   color: '#E07890', group: 'Pinks & Reds' },
  { id: 'coral',      label: 'Coral',        color: '#E67F73', group: 'Pinks & Reds' },
  { id: 'fuchsia',    label: 'Fuchsia',      color: '#C23A6F', group: 'Pinks & Reds' },
  { id: 'red',        label: 'Crimson',      color: '#B02030', group: 'Pinks & Reds' },
  { id: 'rosewood',   label: 'Rosewood',     color: '#8B3A4B', group: 'Pinks & Reds' },
  { id: 'burgundy',   label: 'Burgundy',     color: '#7A1C2E', group: 'Pinks & Reds' },
  { id: 'merlot',     label: 'Merlot',       color: '#5C1A28', group: 'Pinks & Reds' },
  { id: 'wine',       label: 'Wine',         color: '#4A1520', group: 'Pinks & Reds' },

  // Blues & Greens
  { id: 'ice',        label: 'Ice',          color: '#D7E4EC', group: 'Blues & Greens' },
  { id: 'sky',        label: 'Powder Blue',  color: '#AFC9DD', group: 'Blues & Greens' },
  { id: 'periwinkle', label: 'Periwinkle',   color: '#A3A8D6', group: 'Blues & Greens' },
  { id: 'lavender',   label: 'Lavender',     color: '#C5B2D5', group: 'Blues & Greens' },
  { id: 'lilac',      label: 'Soft Lilac',   color: '#D8C3E5', group: 'Blues & Greens' },
  { id: 'cobalt',     label: 'Cobalt',       color: '#2555A0', group: 'Blues & Greens' },
  { id: 'navy',       label: 'Navy',         color: '#1A2E52', group: 'Blues & Greens' },
  { id: 'indigo',     label: 'Indigo',       color: '#2C265C', group: 'Blues & Greens' },
  { id: 'mint',       label: 'Soft Mint',    color: '#B9D8CA', group: 'Blues & Greens' },
  { id: 'sage',       label: 'Sage',         color: '#8DB09A', group: 'Blues & Greens' },
  { id: 'teal',       label: 'Deep Teal',    color: '#176B70', group: 'Blues & Greens' },
  { id: 'forest',     label: 'Forest',       color: '#2D5C44', group: 'Blues & Greens' },
  { id: 'emerald',    label: 'Emerald',      color: '#1F4D3D', group: 'Blues & Greens' },
  { id: 'olive',      label: 'Olive',        color: '#727A45', group: 'Blues & Greens' },

  // Earth & Jewel
  { id: 'gold',       label: 'Gold',         color: '#C6A15B', group: 'Earth & Jewel' },
  { id: 'copper',     label: 'Copper',       color: '#B8734A', group: 'Earth & Jewel' },
  { id: 'mustard',    label: 'Golden Ochre', color: '#C49A3A', group: 'Earth & Jewel' },
  { id: 'caramel',    label: 'Caramel',      color: '#A06B3F', group: 'Earth & Jewel' },
  { id: 'terracotta', label: 'Terracotta',   color: '#B9674E', group: 'Earth & Jewel' },
  { id: 'rust',       label: 'Rust',         color: '#8C3E28', group: 'Earth & Jewel' },
  { id: 'chocolate',  label: 'Chocolate',    color: '#5B3828', group: 'Earth & Jewel' },
  { id: 'plum',       label: 'Plum',         color: '#643A5B', group: 'Earth & Jewel' },
  { id: 'amethyst',   label: 'Amethyst',     color: '#6B4E8C', group: 'Earth & Jewel' },
  { id: 'silver',     label: 'Silver',       color: '#C5C2BC', group: 'Earth & Jewel' },
]

export const CB_COLOR_GROUPS: ColorGroup[] = ['Neutrals', 'Pinks & Reds', 'Blues & Greens', 'Earth & Jewel']

const LIGHT_IDS = new Set([
  'ivory', 'bone', 'blush', 'cream', 'sand', 'nude', 'champagne', 'rose',
  'stone', 'powder', 'pink', 'peach', 'ice', 'sky', 'periwinkle', 'lavender',
  'lilac', 'mint', 'silver', 'camel',
])

export function isLightColor(id: string) {
  return LIGHT_IDS.has(id)
}

export const DARK_COLOR_IDS = new Set(
  CB_COLOR_OPTIONS.filter((c) => !LIGHT_IDS.has(c.id)).map((c) => c.id)
)

export function optionLabel(
  options: readonly { id: string; label: string }[],
  id: string | null
) {
  return options.find((option) => option.id === id)?.label ?? '—'
}

/** Recommended construction when a silhouette is chosen. */
export const TYPE_DEFAULTS: Record<string, {
  strapStyle?: string
  padding?: string
  underwire?: string
  closure?: string
  support?: string
  fabric?: string
}> = {
  everyday:   { strapStyle: 'adjustable',  padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'medium' },
  tshirt:     { strapStyle: 'adjustable',  padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'medium' },
  balconette: { strapStyle: 'classic',     padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'medium' },
  demi:       { strapStyle: 'classic',     padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'light' },
  plunge:     { strapStyle: 'adjustable',  padding: 'medium', underwire: 'wired',    closure: 'front',   support: 'medium' },
  pushup:     { strapStyle: 'adjustable',  padding: 'high',   underwire: 'wired',    closure: 'back',    support: 'high' },
  padded:     { strapStyle: 'adjustable',  padding: 'medium', underwire: 'wired',    closure: 'back',    support: 'medium' },
  wirefree:   { strapStyle: 'classic',     padding: 'none',   underwire: 'wirefree', closure: 'back',    support: 'light' },
  bralette:   { strapStyle: 'classic',     padding: 'none',   underwire: 'wirefree', closure: 'pull-on', support: 'light' },
  triangle:   { strapStyle: 'adjustable',  padding: 'none',   underwire: 'wirefree', closure: 'back',    support: 'light' },
  strapless:  { strapStyle: 'classic',     padding: 'medium', underwire: 'wired',    closure: 'back',    support: 'high' },
  sports:     { strapStyle: 'racerback',   padding: 'none',   underwire: 'wirefree', closure: 'pull-on', support: 'high' },
  racerback:  { strapStyle: 'racerback',   padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'high' },
  longline:   { strapStyle: 'wide',        padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'high' },
  full:       { strapStyle: 'wide',        padding: 'none',   underwire: 'wired',    closure: 'back',    support: 'high' },
  minimizer:  { strapStyle: 'wide',        padding: 'none',   underwire: 'wired',    closure: 'back',    support: 'high' },
  lace:       { strapStyle: 'classic',     padding: 'none',   underwire: 'wired',    closure: 'back',    support: 'medium', fabric: 'lace' },
  bridal:     { strapStyle: 'classic',     padding: 'light',  underwire: 'wired',    closure: 'back',    support: 'medium', fabric: 'lace' },
}
