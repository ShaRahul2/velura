export const CB_BRA_TYPES = [
  { id: 'everyday', label: 'Everyday', price: 0, description: 'Soft support for daily wear.' },
  { id: 'balconette', label: 'Balconette', price: 150, description: 'Shape with a gentle lift.' },
  { id: 'padded', label: 'Padded', price: 200, description: 'A fuller silhouette with smooth cups.' },
  { id: 'sports', label: 'Sports', price: 200, description: 'High support for movement and comfort.' },
  { id: 'lace', label: 'Lace', price: 250, description: 'Delicate lace with feminine detail.' },
  { id: 'wirefree', label: 'Wirefree', price: 100, description: 'Easy comfort with light structure.' },
  { id: 'strapless', label: 'Strapless', price: 250, description: 'Clean lines for off-shoulder looks.' },
  { id: 'bridal', label: 'Bridal', price: 300, description: 'Romantic finishing for special occasions.' },
  { id: 'tshirt', label: 'T-shirt', price: 100, description: 'Invisible under close-fitting clothes.' },
  { id: 'pushup', label: 'Push-up', price: 250, description: 'Contoured lift with a fuller shape.' },
  { id: 'plunge', label: 'Plunge', price: 200, description: 'Low centre for deep necklines.' },
  { id: 'minimizer', label: 'Minimizer', price: 200, description: 'Full coverage with a smooth profile.' },
]

export const CB_STRAP_STYLES = [
  { id: 'classic', label: 'Classic', price: 0 },
  { id: 'adjustable', label: 'Adjustable', price: 0 },
  { id: 'crossback', label: 'Crossback', price: 100 },
  { id: 'wide', label: 'Wide', price: 100 },
]

export const CB_PADDING_OPTIONS = [
  { id: 'none', label: 'None', price: 0 },
  { id: 'light', label: 'Light', price: 150 },
  { id: 'medium', label: 'Medium', price: 200 },
  { id: 'high', label: 'High', price: 250 },
]

export const CB_UNDERWIRE_OPTIONS = [
  { id: 'wired', label: 'Wired', price: 0 },
  { id: 'wirefree', label: 'Wirefree', price: 100 },
]

export const CB_CLOSURE_OPTIONS = [
  { id: 'back', label: 'Back hook', price: 0 },
  { id: 'front', label: 'Front hook', price: 50 },
  { id: 'pull-on', label: 'Pull-on', price: 0 },
]

export const CB_SUPPORT_OPTIONS = [
  { id: 'light', label: 'Light', price: 0 },
  { id: 'medium', label: 'Medium', price: 50 },
  { id: 'high', label: 'High', price: 100 },
]

export const CB_FABRIC_OPTIONS = [
  { id: 'cotton', label: 'Cotton blend', price: 0 },
  { id: 'silk', label: 'Silk stretch', price: 150 },
  { id: 'microfiber', label: 'Microfiber', price: 100 },
  { id: 'lace', label: 'Lace mesh', price: 150 },
  { id: 'smooth', label: 'Smooth knit', price: 0 },
]

export const CB_COLOR_OPTIONS = [
  // ── Neutrals ─────────────────────────────────────────────────
  { id: 'ivory',      label: 'Ivory',         color: '#F5EFE6' },
  { id: 'blush',      label: 'Warm White',    color: '#F8F6F3' },
  { id: 'nude',       label: 'Nude',          color: '#C9B4A0' },
  { id: 'cream',      label: 'Warm Stone',    color: '#EDE9E4' },
  { id: 'champagne',  label: 'Champagne',     color: '#D8C4A0' },
  { id: 'rose',       label: 'Pearl',         color: '#B8A898' },
  { id: 'smoke',      label: 'Smoke',         color: '#9A8878' },
  { id: 'mauve',      label: 'Warm Grey',     color: '#6B6058' },
  { id: 'slate',      label: 'Slate',         color: '#5A5550' },
  { id: 'deep',       label: 'Near Black',    color: '#0F0D0B' },
  { id: 'black',      label: 'Onyx',          color: '#181818' },

  // ── Pinks & Reds ─────────────────────────────────────────────
  { id: 'pink',       label: 'Baby Pink',     color: '#EDAFC0' },
  { id: 'blushrose',  label: 'Blush Rose',    color: '#E07890' },
  { id: 'red',        label: 'Crimson',       color: '#B02030' },
  { id: 'burgundy',   label: 'Burgundy',      color: '#7A1C2E' },

  // ── Blues & Greens ───────────────────────────────────────────
  { id: 'lavender',   label: 'Lavender',      color: '#C5B2D5' },
  { id: 'navy',       label: 'Navy',          color: '#1A2E52' },
  { id: 'cobalt',     label: 'Cobalt',        color: '#2555A0' },
  { id: 'sage',       label: 'Sage',          color: '#8DB09A' },
  { id: 'forest',     label: 'Forest',        color: '#2D5C44' },

  // ── Brights & Earth tones ───────────────────────────────────
  { id: 'sky',        label: 'Powder Blue',   color: '#AFC9DD' },
  { id: 'teal',       label: 'Deep Teal',     color: '#176B70' },
  { id: 'mint',       label: 'Soft Mint',     color: '#B9D8CA' },
  { id: 'olive',      label: 'Olive',         color: '#727A45' },
  { id: 'lilac',      label: 'Soft Lilac',    color: '#D8C3E5' },
  { id: 'plum',       label: 'Plum',          color: '#643A5B' },
  { id: 'coral',      label: 'Coral',         color: '#E67F73' },
  { id: 'terracotta', label: 'Terracotta',    color: '#B9674E' },
  { id: 'mustard',    label: 'Golden Ochre',  color: '#C49A3A' },
  { id: 'chocolate',  label: 'Chocolate',     color: '#5B3828' },

  // Extended — more neutrals & tones
  { id: 'sand',       label: 'Sand',          color: '#E8D9C8' },
  { id: 'stone',      label: 'Stone',         color: '#B8AFA5' },
  { id: 'charcoal',   label: 'Charcoal',      color: '#3C3835' },
  { id: 'peach',      label: 'Peach',         color: '#F4C3A8' },
  { id: 'fuchsia',    label: 'Fuchsia',       color: '#C23A6F' },
  { id: 'rosewood',   label: 'Rosewood',      color: '#8B3A4B' },
  { id: 'emerald',    label: 'Emerald',       color: '#1F4D3D' },
  { id: 'amethyst',   label: 'Amethyst',      color: '#6B4E8C' },
  { id: 'periwinkle', label: 'Periwinkle',    color: '#A3A8D6' },
  { id: 'mocha',      label: 'Mocha',         color: '#6F5344' },
]
