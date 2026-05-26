import type { Product } from '@/types'

const U = (id: string, w = 800, h = 1066) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

// All IDs below are CDN timestamp IDs (verified against images.unsplash.com).
// Short "website slug" IDs (e.g. AdjyrNhFVPI) do NOT work on the CDN.
//
// ID → description
// 1633699124189-17c808027f4a  bra laying on bed — minimal
// 1587631550085-2d4bed859ea9  white brassiere on white textile
// 1599839770015-53df36f312a8  black lace bra on white paper (flat lay)
// 1599836641623-a596a2c44abc  black lace bra beside white flowers
// 1620228757753-b28dacf3015a  blue lace bra on white table
// 1492709560992-3fa75e9e887b  dark structured bra on white textile
// 1568441556126-f36ae0900180  assorted bras + sport bra flat lay
// 1584061554353-f8c337f5dbb9  dark lace bra on white table
// 1689117884149-34bb2b5c8f76  woman in bra top, sitting on bed
// 1617253122768-0ed84fa6cc8e  woman in white lace brassiere (bridal/lace)
// 1497287414967-a8491b593b85  woman with bridal veil, white lace top
// 1488717410150-23adb0336114  woman in white lace top (moonlit)
// 1615599732023-366f797e5887  white lace lingerie detail
// 1594631775771-890a902ae42d  white brassiere on white textile (alt)
// 1566447172003-b861a3a44ae7  dark bikini/bra set — glamour flat lay
// 1572358764342-612d02e2d2d2  black bra product shot

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
    images: [
      U('1633699124189-17c808027f4a'),
      U('1587631550085-2d4bed859ea9'),
      U('1689117884149-34bb2b5c8f76'),
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
    images: [
      U('1599836641623-a596a2c44abc'),
      U('1594631775771-890a902ae42d'),
      U('1599839770015-53df36f312a8'),
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
    images: [
      U('1568441556126-f36ae0900180'),
      U('1587631550085-2d4bed859ea9'),
      U('1633699124189-17c808027f4a'),
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
    images: [
      U('1492709560992-3fa75e9e887b'),
      U('1584061554353-f8c337f5dbb9'),
      U('1599839770015-53df36f312a8'),
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
    images: [
      U('1566447172003-b861a3a44ae7'),
      U('1492709560992-3fa75e9e887b'),
      U('1689117884149-34bb2b5c8f76'),
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
    images: [
      U('1620228757753-b28dacf3015a'),
      U('1599836641623-a596a2c44abc'),
      U('1599839770015-53df36f312a8'),
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
    images: [
      U('1617253122768-0ed84fa6cc8e'),
      U('1594631775771-890a902ae42d'),
      U('1615599732023-366f797e5887'),
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
    images: [
      U('1584061554353-f8c337f5dbb9'),
      U('1568441556126-f36ae0900180'),
      U('1572358764342-612d02e2d2d2'),
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
    images: [
      U('1594631775771-890a902ae42d'),
      U('1633699124189-17c808027f4a'),
      U('1568441556126-f36ae0900180'),
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
    images: [
      U('1587631550085-2d4bed859ea9'),
      U('1594631775771-890a902ae42d'),
      U('1633699124189-17c808027f4a'),
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
    images: [
      U('1689117884149-34bb2b5c8f76'),
      U('1587631550085-2d4bed859ea9'),
      U('1633699124189-17c808027f4a'),
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
    images: [
      U('1615599732023-366f797e5887'),
      U('1599836641623-a596a2c44abc'),
      U('1599839770015-53df36f312a8'),
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
    images: [
      U('1572358764342-612d02e2d2d2'),
      U('1689117884149-34bb2b5c8f76'),
      U('1584061554353-f8c337f5dbb9'),
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
    images: [
      U('1497287414967-a8491b593b85'),
      U('1617253122768-0ed84fa6cc8e'),
      U('1615599732023-366f797e5887'),
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
    images: [
      U('1488717410150-23adb0336114'),
      U('1615599732023-366f797e5887'),
      U('1617253122768-0ed84fa6cc8e'),
    ],
  },
]
