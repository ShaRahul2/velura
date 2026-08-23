const LABELS: Record<string, string> = {
  '#D4B896': 'Nude',
  '#1C1C1C': 'Midnight',
  '#8A9090': 'Stone',
  '#E8C4B8': 'Blush',
  '#F0EBE0': 'Ivory',
  '#9CAF88': 'Sage',
  '#7B5B4E': 'Mocha',
  '#8B1A1A': 'Burgundy',
  '#1A3A5C': 'Navy',
  '#C9A84C': 'Gold',
  '#E8D5A3': 'Champagne',
  '#2A2A2A': 'Soft black',
  '#C4948A': 'Dusty rose',
  '#6B7280': 'Slate',
  '#3D3D3D': 'Charcoal',
  '#D4C4A0': 'Sand',
  '#B0A8A0': 'Dove',
  '#B8A0A8': 'Mauve',
  '#F5F0E8': 'Pearl',
  '#E8D9C8': 'Linen',
  '#F8F6F3': 'Warm white',
  '#3C3835': 'Graphite',
  '#6B6058': 'Warm grey',
  '#7A1C2E': 'Wine',
  '#C6A15B': 'Gold',
  '#181818': 'Onyx',
  '#1A2E52': 'Ink navy',
  '#643A5B': 'Plum',
  '#5A5550': 'Slate',
  '#8DB09A': 'Sage',
  '#6F5344': 'Mocha',
  '#B8AFA5': 'Stone',
  '#EFE6D8': 'Bone',
  '#D8C4A0': 'Champagne',
  '#C4A574': 'Camel',
  '#8A8580': 'Smoke',
  '#B02030': 'Crimson',
  '#727A45': 'Olive',
  '#AFC9DD': 'Powder blue',
}

export function colorLabel(hex: string): string {
  const key = (hex.startsWith('#') ? hex : `#${hex}`).toUpperCase()
  return LABELS[key] ?? 'Colour'
}


