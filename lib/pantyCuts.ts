/** The six panty cuts, drawn on a 64×48 grid. Shared by the home launch block and category art. */
export interface PantyCut {
  id: string
  label: string
  coverage: string
  path: string
}

export const PANTY_CUTS: PantyCut[] = [
  { id: 'bikini',    label: 'Bikini',     coverage: 'Low',   path: 'M8 10 H56 C50 22 42 36 38 40 H26 C22 36 14 22 8 10Z' },
  { id: 'hipster',   label: 'Hipster',    coverage: 'Mid',   path: 'M6 12 H58 V22 C50 26 42 36 38 40 H26 C22 36 14 26 6 22Z' },
  { id: 'brief',     label: 'Brief',      coverage: 'Full',  path: 'M8 6 H56 V16 C48 24 42 36 38 42 H26 C22 36 16 24 8 16Z' },
  { id: 'highwaist', label: 'High-waist', coverage: 'Full+', path: 'M10 2 H54 V16 C48 24 42 36 38 44 H26 C22 36 16 24 10 16Z' },
  { id: 'boyshort',  label: 'Boyshort',   coverage: 'Full',  path: 'M8 8 H56 V30 H44 C40 30 38 34 36 38 H28 C26 34 24 30 20 30 H8Z' },
  { id: 'thong',     label: 'Thong',      coverage: 'Minimal', path: 'M8 10 H56 C46 18 36 30 34 42 H30 C28 30 18 18 8 10Z' },
]
