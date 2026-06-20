import type { Product } from '@/types'

const U = (id: string, w = 800, h = 1066) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

// ─── Verified CDN timestamp IDs ──────────────────────────────────────────────
//
// Original verified set (16 IDs):
// 1633699124189-17c808027f4a  bra laying on bed — minimal (everyday)
// 1587631550085-2d4bed859ea9  white brassiere on white textile (everyday)
// 1594631775771-890a902ae42d  white brassiere on white textile — alt angle (everyday)
// 1689117884149-34bb2b5c8f76  woman in bra top, sitting on bed (lifestyle)
// 1492709560992-3fa75e9e887b  dark structured bra on white textile (push-up/dark)
// 1566447172003-b861a3a44ae7  dark bikini/bra set — glamour flat lay (push-up)
// 1584061554353-f8c337f5dbb9  dark lace bra on white table (dark lace)
// 1572358764342-612d02e2d2d2  black bra product shot (dark/structured)
// 1620228757753-b28dacf3015a  blue lace bra on white table (lace)
// 1599836641623-a596a2c44abc  black lace bra beside white flowers (lace)
// 1599839770015-53df36f312a8  black lace bra on white paper — flat lay (lace)
// 1615599732023-366f797e5887  white lace lingerie detail (bridal/lace)
// 1568441556126-f36ae0900180  assorted bras + sport bra flat lay (sports/all)
// 1617253122768-0ed84fa6cc8e  woman in white lace brassiere (bridal lifestyle)
// 1497287414967-a8491b593b85  woman with bridal veil, white lace top (bridal)
// 1488717410150-23adb0336114  woman in white lace top — moonlit (bridal)
//
// Added May 2025 — from "bra product photography" Unsplash search (12 new IDs):
// 1612858249937-1cc0852093dd  bra product shot — Feb 2021 collection, frame A
// 1612858250170-dd5b2e82a8b8  bra product shot — Feb 2021 collection, frame B
// 1612858249784-5883876e0d52  bra product shot — Feb 2021 collection, frame C
// 1612858250233-0f4e4a6081d3  bra product shot — Feb 2021 collection, frame D
// 1612858250298-8cbd5f65e6e8  bra product shot — Feb 2021 collection, frame E
// 1612858250434-b5358e2b3625  bra product shot — Feb 2021 collection, frame F
// 1612858249816-5a91a9fb9886  bra product shot — Feb 2021 collection, frame G
// 1638382874361-5d1438548f10  bra product flat lay — Dec 2021, frame A
// 1638382875827-9be89d76946e  bra product flat lay — Dec 2021, frame B
// 1638382875668-3a1751bb6f20  bra product flat lay — Dec 2021, frame C
// 1768794270203-2572cecafcf7  bra product photography — 2025
// 1610241519159-8a62634bac9a  bra product photography — Jan 2021
//
// Added May 2025 — from "seamless underwear flatlay" Unsplash search (12 new IDs):
// 1606226286076-19b2f9ed68f3  seamless underwear flat lay — Dec 2020
// 1610071531527-b68d92c16a8c  seamless bra flat lay — Jan 2021
// 1641128888531-830e8c30468c  seamless/sports bra flat lay — Jan 2022
// 1591385160808-870887e6fe20  seamless bralette flat lay — Jun 2020
// 1577746838292-8c224f0b7350  seamless knit bra flat lay — Dec 2019
// 1655151867987-7a0e99345d62  seamless wireless bra — Jun 2022, frame A
// 1679006410328-aa6914e05d68  seamless wireless bra — Apr 2023
// 1655151867984-b1e1cf33a456  seamless wireless bra — Jun 2022, frame B
// 1523654999808-59842135e652  light seamless bra flat lay — Jul 2018
// 1573581042550-97e5c7f034e4  sports/seamless bra flat lay — Nov 2019
// 1570724097412-dca3aa07af77  wireless bra flat lay — Oct 2019
// 1591385291640-8180a44df171  everyday wireless bra — Jun 2020
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
      U('1633699124189-17c808027f4a'),   // bra on bed — minimal
      U('1587631550085-2d4bed859ea9'),   // white brassiere, white textile
      U('1612858249937-1cc0852093dd'),   // bra product shot, frame A
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
      U('1594631775771-890a902ae42d'),   // white brassiere — alt angle
      U('1612858250170-dd5b2e82a8b8'),   // bra product shot, frame B
      U('1612858249784-5883876e0d52'),   // bra product shot, frame C
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
      U('1612858250233-0f4e4a6081d3'),   // bra product shot, frame D
      U('1612858250298-8cbd5f65e6e8'),   // bra product shot, frame E
      U('1689117884149-34bb2b5c8f76'),   // woman in bra top — lifestyle
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
      U('1492709560992-3fa75e9e887b'),   // dark structured bra on white textile
      U('1566447172003-b861a3a44ae7'),   // dark bikini/bra — glamour flat lay
      U('1584061554353-f8c337f5dbb9'),   // dark lace bra on white table
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
      U('1572358764342-612d02e2d2d2'),   // black bra product shot
      U('1612858250434-b5358e2b3625'),   // bra product shot, frame F
      U('1638382874361-5d1438548f10'),   // bra flat lay — Dec 2021, frame A
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
      U('1620228757753-b28dacf3015a'),   // blue lace bra on white table
      U('1599836641623-a596a2c44abc'),   // black lace bra beside white flowers
      U('1615599732023-366f797e5887'),   // white lace lingerie detail
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
      U('1599839770015-53df36f312a8'),   // black lace bra — flat lay
      U('1638382875827-9be89d76946e'),   // bra flat lay — Dec 2021, frame B
      U('1638382875668-3a1751bb6f20'),   // bra flat lay — Dec 2021, frame C
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
      U('1568441556126-f36ae0900180'),   // assorted bras + sport bra flat lay
      U('1606226286076-19b2f9ed68f3'),   // seamless underwear flat lay — Dec 2020
      U('1610071531527-b68d92c16a8c'),   // seamless bra flat lay — Jan 2021
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
      U('1641128888531-830e8c30468c'),   // seamless/sports bra flat lay — Jan 2022
      U('1591385160808-870887e6fe20'),   // seamless bralette flat lay — Jun 2020
      U('1577746838292-8c224f0b7350'),   // seamless knit bra flat lay — Dec 2019
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
      U('1655151867987-7a0e99345d62'),   // seamless wireless bra — Jun 2022, frame A
      U('1679006410328-aa6914e05d68'),   // seamless wireless bra — Apr 2023
      U('1655151867984-b1e1cf33a456'),   // seamless wireless bra — Jun 2022, frame B
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
      U('1523654999808-59842135e652'),   // light seamless bra flat lay — Jul 2018
      U('1573581042550-97e5c7f034e4'),   // sports/seamless bra flat lay — Nov 2019
      U('1570724097412-dca3aa07af77'),   // wireless bra flat lay — Oct 2019
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
      U('1591385291640-8180a44df171'),   // everyday wireless bra — Jun 2020
      U('1768794270203-2572cecafcf7'),   // bra product photography — 2025
      U('1612858249816-5a91a9fb9886'),   // bra product shot, frame G
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
      U('1610241519159-8a62634bac9a'),   // bra product photography — Jan 2021
      U('1612858250170-dd5b2e82a8b8'),   // bra product shot, frame B
      U('1591385160808-870887e6fe20'),   // seamless bralette flat lay — Jun 2020
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
      U('1497287414967-a8491b593b85'),   // woman with bridal veil, white lace top
      U('1617253122768-0ed84fa6cc8e'),   // woman in white lace brassiere (lifestyle)
      U('1615599732023-366f797e5887'),   // white lace lingerie detail
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
      U('1488717410150-23adb0336114'),   // woman in white lace top — moonlit editorial
      U('1638382874361-5d1438548f10'),   // bra flat lay — Dec 2021, frame A
      U('1638382875668-3a1751bb6f20'),   // bra flat lay — Dec 2021, frame C
    ],
  },
]
