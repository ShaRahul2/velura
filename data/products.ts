import type { Product } from '@/types'

const U = (seed: string, w = 800, h = 1066) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

// ─── New Premium Editorial Images (Picsum seeded for variety and quality) ─────
// Fresh high-res stock images tailored for Onyx & Pearl aesthetic.
// Neutral tones, soft fabrics, flat lays and lifestyle for shopping page.
// Replace with Cloudinary/real photography when ready. Minimum 3 per product.
// ─────────────────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── EVERYDAY ─────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'FeatherSoft',
    story: 'The everyday bra that feels like a second skin.',
    sub: 'Microfiber · seamless · 28A–44DD',
    price: 699,
    oldPrice: 899,
    emoji: '☁️',
    badge: 'Bestseller',
    cat: 'everyday',
    rating: 4.8,
    reviews: 1342,
    fabric: 'Ultra-soft microfiber',
    support: 'Medium',
    sizes: '28A–44DD',
    colorways: ['#D4B896', '#1C1C1C', '#8A9090'],  // Nude · Midnight · Stone
    images: [
      U('velura-feathersoft-front'),
      U('velura-feathersoft-flat'),
      U('velura-feathersoft-lifestyle'),
    ],
  },
  {
    id: 2,
    name: 'MorningDew',
    story: 'A light, everyday lift with pretty tonal lace touches.',
    sub: 'Modal blend · light lift · 28A–42D',
    price: 799,
    oldPrice: null,
    emoji: '🌿',
    badge: 'New',
    cat: 'everyday',
    rating: 4.7,
    reviews: 812,
    fabric: 'Modal stretch',
    support: 'Light',
    sizes: '28A–42D',
    colorways: ['#E8C4B8', '#F0EBE0', '#9CAF88'],  // Blush · Ivory · Sage
    images: [
      U('velura-morningdew-front'),
      U('velura-morningdew-flat'),
      U('velura-morningdew-lifestyle'),
    ],
  },
  {
    id: 3,
    name: 'NudeSense',
    story: 'Invisible under tees, flattering under every neckline.',
    sub: 'Nude knit · breathable · 30B–44DD',
    price: 899,
    oldPrice: null,
    emoji: '🤍',
    badge: null,
    cat: 'everyday',
    rating: 4.6,
    reviews: 578,
    fabric: 'Micro-mesh knit',
    support: 'Medium',
    sizes: '30B–44DD',
    colorways: ['#D4B896', '#E8C4B8', '#7B5B4E'],  // Nude · Blush · Mocha
    images: [
      U('velura-nudesense-front'),
      U('velura-nudesense-flat'),
      U('velura-nudesense-lifestyle'),
    ],
  },

  // ── PUSH-UP ───────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Velvet Plunge',
    story: 'That evening shape that still feels soft at every hour.',
    sub: 'Velvet · push-up · 30B–38DD',
    price: 1099,
    oldPrice: 1299,
    emoji: '💫',
    badge: 'Premium',
    cat: 'pushup',
    rating: 4.9,
    reviews: 720,
    fabric: 'Soft velvet',
    support: 'High',
    sizes: '30B–38DD',
    colorways: ['#1C1C1C', '#8B1A1A', '#1A3A5C'],  // Midnight · Burgundy · Navy
    images: [
      U('velura-velvetplunge-front'),
      U('velura-velvetplunge-flat'),
      U('velura-velvetplunge-lifestyle'),
    ],
  },
  {
    id: 5,
    name: 'GoldenHour',
    story: 'A glowy lift with just enough hold for your favourite dress.',
    sub: 'Satin finish · padded · 32A–40DD',
    price: 1199,
    oldPrice: null,
    emoji: '✨',
    badge: 'Sale',
    cat: 'pushup',
    rating: 4.7,
    reviews: 409,
    fabric: 'Satin-backed foam',
    support: 'High',
    sizes: '32A–40DD',
    colorways: ['#C9A84C', '#E8D5A3', '#1C1C1C'],  // Gold · Champagne · Midnight
    images: [
      U('velura-goldenhour-front'),
      U('velura-goldenhour-flat'),
      U('velura-goldenhour-lifestyle'),
    ],
  },

  // ── LACE ──────────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Floral Luxe',
    story: 'Delicate lace that makes every day feel special.',
    sub: 'French lace · underwire · 30B–42DD',
    price: 1499,
    oldPrice: 1699,
    emoji: '🌸',
    badge: 'New',
    cat: 'lace',
    rating: 4.8,
    reviews: 658,
    fabric: 'French lace',
    support: 'Medium',
    sizes: '30B–42DD',
    colorways: ['#F0EBE0', '#1C1C1C', '#E8C4B8'],  // Ivory · Midnight · Blush
    images: [
      U('velura-floralluxe-front'),
      U('velura-floralluxe-flat'),
      U('velura-floralluxe-lifestyle'),
    ],
  },
  {
    id: 7,
    name: 'SilkDream',
    story: 'Soft lace cups with an effortless bridal glow.',
    sub: 'Silk blend · unlined · 32A–40DD',
    price: 1599,
    oldPrice: null,
    emoji: '👰',
    badge: 'Premium',
    cat: 'lace',
    rating: 4.9,
    reviews: 296,
    fabric: 'Silk-blend lace',
    support: 'Light',
    sizes: '32A–40DD',
    colorways: ['#F0EBE0', '#2A2A2A', '#C4948A'],  // Ivory · Soft Black · Dusty Rose
    images: [
      U('velura-silkdream-front'),
      U('velura-silkdream-flat'),
      U('velura-silkdream-lifestyle'),
    ],
  },

  // ── SPORTS ───────────────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'ArmorX',
    story: 'A high-performance silhouette built for your toughest moves.',
    sub: 'Compression mesh · racerback · 30B–42DD',
    price: 999,
    oldPrice: 1099,
    emoji: '🏋️‍♀️',
    badge: 'Comfort Fit',
    cat: 'sports',
    rating: 4.6,
    reviews: 531,
    fabric: 'Technical mesh',
    support: 'High',
    sizes: '30B–42DD',
    colorways: ['#1C1C1C', '#6B7280', '#1A3A5C'],  // Midnight · Slate · Navy
    images: [
      U('velura-armorx-front'),
      U('velura-armorx-flat'),
      U('velura-armorx-lifestyle'),
    ],
  },
  {
    id: 9,
    name: 'ZenFlow',
    story: 'Smooth support with a soft finish for low-impact days.',
    sub: 'Seamless stretch · light support · 28A–38DD',
    price: 799,
    oldPrice: null,
    emoji: '🧘‍♀️',
    badge: null,
    cat: 'sports',
    rating: 4.5,
    reviews: 284,
    fabric: 'Stretch jersey',
    support: 'Light',
    sizes: '28A–38DD',
    colorways: ['#3D3D3D', '#C4948A', '#9CAF88'],  // Charcoal · Dusty Rose · Sage
    images: [
      U('velura-zenflow-front'),
      U('velura-zenflow-flat'),
      U('velura-zenflow-lifestyle'),
    ],
  },

  // ── SEAMLESS ──────────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'CloudLift',
    story: 'A barely-there feel with smoothing, edge-free cups.',
    sub: 'Seamless knit · invisible · 28A–40DD',
    price: 549,
    oldPrice: 749,
    emoji: '☁️',
    badge: 'Sale',
    cat: 'seamless',
    rating: 4.4,
    reviews: 478,
    fabric: 'Seamless knit',
    support: 'Light',
    sizes: '28A–40DD',
    colorways: ['#D4B896', '#1C1C1C', '#E8C4B8'],  // Nude · Midnight · Blush
    images: [
      U('velura-cloudlift-front'),
      U('velura-cloudlift-flat'),
      U('velura-cloudlift-lifestyle'),
    ],
  },
  {
    id: 11,
    name: 'BareEase',
    story: 'Curve-smoothing stretch that disappears under the closest fit.',
    sub: 'Stretch knit · wireless · 30B–44DD',
    price: 949,
    oldPrice: null,
    emoji: '🪶',
    badge: 'Comfort Fit',
    cat: 'seamless',
    rating: 4.6,
    reviews: 622,
    fabric: 'Lightweight stretch',
    support: 'Medium',
    sizes: '30B–44DD',
    colorways: ['#D4C4A0', '#B0A8A0', '#D4B896'],  // Sand · Dove Grey · Nude
    images: [
      U('velura-bareease-front'),
      U('velura-bareease-flat'),
      U('velura-bareease-lifestyle'),
    ],
  },

  // ── PLUS ──────────────────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'CurveLove',
    story: 'Designed for fuller curves with secure support and soft edges.',
    sub: 'Stretch lace · wide straps · 34C–50H',
    price: 1149,
    oldPrice: 1249,
    emoji: '❤️',
    badge: 'Bestseller',
    cat: 'plus',
    rating: 4.8,
    reviews: 936,
    fabric: 'Stretch lace',
    support: 'High',
    sizes: '34C–50H',
    colorways: ['#D4B896', '#1C1C1C', '#B8A0A8'],  // Nude · Midnight · Mauve
    images: [
      U('velura-curvelove-front'),
      U('velura-curvelove-flat'),
      U('velura-curvelove-lifestyle'),
    ],
  },
  {
    id: 13,
    name: 'SoftCurve',
    story: 'A supportive fit with the softest wired cups we make.',
    sub: 'Microfiber · wired · 34B–48G',
    price: 1049,
    oldPrice: null,
    emoji: '🌺',
    badge: null,
    cat: 'plus',
    rating: 4.7,
    reviews: 389,
    fabric: 'Smooth microfiber',
    support: 'High',
    sizes: '34B–48G',
    colorways: ['#E8C4B8', '#F0EBE0', '#1C1C1C'],  // Blush · Ivory · Midnight
    images: [
      U('velura-softcurve-front'),
      U('velura-softcurve-flat'),
      U('velura-softcurve-lifestyle'),
    ],
  },

  // ── BRIDAL ────────────────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Ivory Bloom',
    story: 'Bridal romance with gentle support in a soft ivory palette.',
    sub: 'Embroidered lace · balconette · 32A–40DD',
    price: 2199,
    oldPrice: 2499,
    emoji: '🤍',
    badge: 'Premium',
    cat: 'bridal',
    rating: 4.9,
    reviews: 184,
    fabric: 'Embroidered lace',
    support: 'Medium',
    sizes: '32A–40DD',
    colorways: ['#F5F0E8', '#F0EBE0', '#E8C4B8'],  // Ivory · Pearl · Blush
    images: [
      U('velura-ivorybloom-front'),
      U('velura-ivorybloom-flat'),
      U('velura-ivorybloom-lifestyle'),
    ],
  },
  {
    id: 15,
    name: 'MoonlitRose',
    story: 'A dusky bridal statement with rose-gold shimmer and soft cups.',
    sub: 'Satin lace · demi · 32B–40DD',
    price: 2499,
    oldPrice: null,
    emoji: '🌙',
    badge: 'New',
    cat: 'bridal',
    rating: 4.8,
    reviews: 213,
    fabric: 'Satin lace',
    support: 'Medium',
    sizes: '32B–40DD',
    colorways: ['#E8C4B8', '#C4948A', '#F5F0E8'],  // Blush · Rose Gold · Ivory
    images: [
      U('velura-moonlitrose-front'),
      U('velura-moonlitrose-flat'),
      U('velura-moonlitrose-lifestyle'),
    ],
  },
]
