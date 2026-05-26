import type { Product } from '@/types'

const U = (id: string, w = 800, h = 1066) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

// ── Image inventory (all brand-safe: product flat-lays or lingerie-only shots)
//
//  PRODUCT-ONLY (no people, no brand logos):
//  tbKpfNvpq4Y  bra laying on bed — minimal, neutral surface
//  RmttRpsyjb0  white brassiere on white textile — seamless/everyday
//  47N0f0XOsHw  black-and-pink bra on white textile — structured, glamour
//  AdjyrNhFVPI  assorted bra + sport bra flat lay — range/overview
//  tFbsY14l-io  black lace bra on white paper — lace detail
//  slCC8-LEJ_E  black lace bra on white table — structured lace
//  _0k3MLWaSyU  black lace bra beside white flowers — floral, romantic
//  2XaxD_LyxZk  blue lace bra on white table — lace, Floral Luxe
//  f9ZalyUbcRk  bras hanging on a clothes line — airy, everyday
//  tjOKfGLN5To  lingerie flat lay with spring flowers — romantic/bridal
//
//  LINGERIE-ONLY MODEL SHOTS (no branded clothing/accessories visible):
//  3t8NAMZew9k  woman in bra top, sitting on bed — everyday lifestyle
//  mqBEBXiBQvI  woman in white lace brassiere & panty set — bridal/silk
//  2qsmezj9WEA  woman in white lace top with veil — bridal editorial
//  eya7vX50lb0  woman in white lace top — bridal/moonlit lifestyle
//  5jWt-kClzt8  woman in white lace — delicate lace detail
//  E93sod49phw  curvy woman — body-positive, plus-size

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
      U('tbKpfNvpq4Y'),   // bra on bed — minimal, soft surface
      U('RmttRpsyjb0'),   // white bra on white textile — everyday clean
      U('3t8NAMZew9k'),   // worn lifestyle — second-skin feel
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
      U('_0k3MLWaSyU'),   // lace bra with white flowers — morning, romantic
      U('f9ZalyUbcRk'),   // bras on clothes line — airy, morning light
      U('tFbsY14l-io'),   // lace detail flat lay — tonal lace touches
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
      U('AdjyrNhFVPI'),   // neutral-toned bra flat lay — nude range
      U('RmttRpsyjb0'),   // white/nude bra on white — invisible feel
      U('tbKpfNvpq4Y'),   // product on surface — minimal
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
      U('47N0f0XOsHw'),   // dark structured bra on white — evening glamour
      U('slCC8-LEJ_E'),   // black lace bra on table — velvet/editorial
      U('tFbsY14l-io'),   // lace texture detail
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
      U('tjOKfGLN5To'),   // lingerie flat lay with flowers — warm, golden
      U('47N0f0XOsHw'),   // structured bra — padded cup detail
      U('3t8NAMZew9k'),   // worn — golden-hour lifestyle
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
      U('2XaxD_LyxZk'),   // blue lace bra on white table — French lace product
      U('_0k3MLWaSyU'),   // lace bra with flowers — floral editorial
      U('tFbsY14l-io'),   // lace detail flat lay — underwire structure
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
      U('mqBEBXiBQvI'),   // woman in white lace brassiere — silk-lace editorial
      U('RmttRpsyjb0'),   // white bra on white — silk unlined feel
      U('5jWt-kClzt8'),   // white lace detail — delicate cups
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
      U('f9ZalyUbcRk'),   // bras on clothes line — airy, compression context
      U('AdjyrNhFVPI'),   // assorted bra flat lay — includes sport bra
      U('tbKpfNvpq4Y'),   // minimal product shot
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
      U('RmttRpsyjb0'),   // clean white bra — minimal, zen feel
      U('f9ZalyUbcRk'),   // bras hanging — light, easy movement
      U('AdjyrNhFVPI'),   // flat lay range — sports context
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
      U('slCC8-LEJ_E'),   // bra on white table — seamless, minimal
      U('RmttRpsyjb0'),   // white bra on white textile — edge-free
      U('tbKpfNvpq4Y'),   // product on surface — barely-there
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
      U('3t8NAMZew9k'),   // woman in bra on bed — smooth, wireless lifestyle
      U('RmttRpsyjb0'),   // clean minimal product — disappears under clothes
      U('tbKpfNvpq4Y'),   // product only — wireless
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
      U('E93sod49phw'),   // curvy woman — body-positive, confident
      U('_0k3MLWaSyU'),   // lace bra with flowers — stretch lace detail
      U('tFbsY14l-io'),   // lace flat lay — fabric quality
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
      U('tFbsY14l-io'),   // structured lace bra — wired cup detail
      U('E93sod49phw'),   // curvy model — inclusive sizing
      U('slCC8-LEJ_E'),   // bra on table — supportive structure
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
      U('2qsmezj9WEA'),   // woman with bridal veil in white lace — ivory editorial
      U('mqBEBXiBQvI'),   // white lace brassiere set — product
      U('tjOKfGLN5To'),   // romantic lingerie with flowers — bridal mood
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
      U('eya7vX50lb0'),   // woman in white lace — moonlit, dusky editorial
      U('5jWt-kClzt8'),   // delicate lace — rose-toned detail
      U('mqBEBXiBQvI'),   // white lace brassiere — satin product
    ],
  },
]
