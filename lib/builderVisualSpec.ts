import type { BuilderState } from '@/types'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

/**
 * Normalised view-model derived from BuilderState.
 * Used by both the deterministic SVG renderer (BraSVG) and the AI prompt builder.
 * All nulls are resolved to sensible defaults so downstream code never needs to guard.
 */
export interface BuilderVisualSpec {
  braType:    string   // one of the configured custom bra silhouettes
  strapStyle: string   // classic | adjustable | crossback | wide | none
  padding:    string   // none | light | medium | high
  underwire:  string   // wired | wirefree
  closure:    string   // back | front | pull-on
  support:    string   // light | medium | high
  fabric:     string   // cotton | silk | microfiber | lace | smooth
  colorId:    string
  colorLabel: string
  colorHex:   string
  size:       string   // "34B" or "—"
}

export function buildVisualSpec(state: BuilderState): BuilderVisualSpec {
  const colorEntry  = CB_COLOR_OPTIONS.find((c) => c.id === (state.color ?? 'cream'))
  const isStrapless = state.braType === 'strapless'

  return {
    braType:    state.braType    ?? 'everyday',
    strapStyle: isStrapless ? 'none' : (state.strapStyle ?? 'classic'),
    padding:    state.padding    ?? 'none',
    underwire:  state.underwire  ?? 'wired',
    closure:    state.closure    ?? 'back',
    support:    state.support    ?? 'medium',
    fabric:     state.fabric     ?? 'cotton',
    colorId:    state.color      ?? 'cream',
    colorLabel: colorEntry?.label ?? 'Warm Stone',
    colorHex:   colorEntry?.color ?? '#EDE9E4',
    size:       state.band && state.cup ? `${state.band}${state.cup}` : '—',
  }
}

/**
 * Deterministic hash of the visual dimensions of a spec.
 * Size is excluded — a flat-lay bra photo looks identical at 32A and 44DD.
 * Used as the Cloudinary public_id for AI-preview caching.
 */
export function specToHash(spec: BuilderVisualSpec): string {
  const key = [
    spec.braType, spec.strapStyle, spec.padding,
    spec.underwire, spec.closure, spec.support,
    spec.fabric,   spec.colorId,
  ].join('|')
  // djb2-inspired hash → base-36 string, 8 chars minimum
  let h = 5381
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(h, 33) ^ key.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36).padStart(8, '0')
}

/** Deterministic 0–999999 seed so the same spec renders the same preview. */
export function specToSeed(spec: BuilderVisualSpec, salt = 0): number {
  const hash = specToHash(spec)
  let n = salt >>> 0
  for (let i = 0; i < hash.length; i++) {
    n = Math.imul(n ^ hash.charCodeAt(i), 16777619) >>> 0
  }
  return n % 1_000_000
}

/**
 * Full prompt for HuggingFace / Replicate (supports long prompts, ~400 words).
 * Uses fashion-specific visual language so diffusion models render the right silhouette.
 * Explicitly bans human bodies, mannequin faces, text, and logos.
 */
export function buildAIPrompt(spec: BuilderVisualSpec): string {
  // ── Bra type — describe the physical silhouette and cup shape ───────────────
  const braTypeDesc: Record<string, string> = {
    everyday:   'everyday T-shirt bra with smooth seamless rounded cups, moderate coverage, minimal visible seaming',
    balconette: 'balconette bra with straight-across horizontal cup neckline, squared-off upper cup, creates wide-set lift',
    padded:     'padded push-up bra with deep centre plunge, contoured foam-lined cups angled toward centre for cleavage',
    sports:     'sports bra with wide flat elastic under-band, compression encapsulation panels, racerback-friendly cut',
    lace:       'delicate lace bra with sheer floral lace overlay on cups, scalloped trim at the cup edge, semi-transparent upper cup',
    wirefree:   'wire-free soft-cup bra with gently shaped flexible cups, comfortable wide band, no visible boning',
    strapless:  'strapless bra with silicone non-slip grip at the top edge, boned structured cups, wide supportive under-band',
    bridal:     'bridal bra with ivory lace overlay, hand-stitched satin ribbon bow at centre gore, scalloped trim along cup edge',
    tshirt:     'T-shirt bra with ultra-smooth moulded cups and invisible bonded edges for a seamless profile',
    pushup:     'push-up bra with angled contoured cups, graduated padding and a lifted centre silhouette',
    plunge:     'plunge bra with a very low centre gore, deep V neckline and softly angled cups',
    minimizer:  'full-coverage minimizer bra with broad side panels, wide cups and a smooth reduced-profile silhouette',
    bralette:   'soft unlined bralette with triangle-adjacent cups, fine straps, no underwire, delicate and barely-there',
    triangle:   'minimal triangle-cup bra with pointed cups, thin spaghetti straps, airy coverage',
    longline:   'longline bra with an extended ribbed under-band covering the upper torso, structured cups',
    demi:       'demi-cup bra with a lower cut upper cup, open décolletage, light lift',
    racerback:  'racerback bra with straps that meet at the spine, open back, secure encapsulation',
    full:       'full-coverage bra with high-cut cups, wide side wings, maximum containment',
  }

  // ── Straps — describe how they look and connect ─────────────────────────────
  const strapDesc: Record<string, string> = {
    classic:     'thin classic parallel shoulder straps',
    adjustable:  'adjustable shoulder straps with sliding metal hardware rings',
    crossback:   'straps that cross diagonally at the back to form a clear X shape',
    wide:        'broad padded comfort shoulder straps, approximately 3cm wide',
    none:        'no shoulder straps, fully strapless silhouette',
    racerback:   'racerback straps that join at the centre of the back',
    halter:      'halter straps that meet behind the neck',
    convertible: 'convertible straps with clip hardware at the cup for multiway wear',
  }

  // ── Padding — describe the cup profile impact ────────────────────────────────
  const paddingDesc: Record<string, string> = {
    none:   'flat unpadded cups retaining the natural shape of the fabric',
    light:  'lightly padded cups with a thin foam insert for subtle gentle shaping',
    medium: 'medium foam-padded cups with a clear lifted rounded profile',
    high:   'heavily padded push-up cups with thick contoured foam inserts, dramatically lifted and full',
  }

  // ── Fabric — describe texture and surface quality ───────────────────────────
  const fabricDesc: Record<string, string> = {
    cotton:     'soft matte cotton-stretch fabric with a slightly textured knit surface',
    silk:       'lustrous silk-satin fabric with a visible liquid sheen and smooth fluid drape',
    microfiber: 'ultra-smooth microfiber fabric with a barely-there matte powdery finish',
    lace:       'sheer floral lace with intricate raised motif, semi-transparent and delicate',
    smooth:     'smooth compression knit fabric with a fine matte surface and subtle sheen',
    mesh:       'fine air-mesh fabric with an open knit and slight sheen through the holes',
    velvet:     'dense crushed-velvet fabric with a rich pile catching the light',
    satin:      'high-gloss satin fabric with a liquid highlight along the cup curve',
    modal:      'soft modal-blend knit with a cool hand and matte drape',
  }

  // ── Closure — describe what is visible ──────────────────────────────────────
  const closureDesc: Record<string, string> = {
    back:     'traditional hook-and-eye closure at the back band with 3 rows of hooks',
    front:    'front-fastening centre clasp closure visible at the gore, metal hook-and-pin mechanism',
    'pull-on': 'seamless pull-on design with no clasp, elasticated band, no visible closure hardware',
  }

  // ── Underwire — describe construction detail ─────────────────────────────────
  const wireDesc = spec.underwire === 'wired'
    ? 'underwired construction with a visible wire channel sewn into the base of each cup'
    : 'wire-free soft construction with no rigid wire, flexible casing only'

  return (
    `Luxury e-commerce product photograph of ONE empty lingerie bra lying flat, garment only. ` +
    `No person, no model, no mannequin, no torso, no skin, no face, no hands, no body. ` +
    `Centered on warm ivory linen. Soft studio key light from the upper left, gentle fill, no harsh shadows. ` +
    `Portrait 3:4 still-life. ` +
    `The bra is a ${braTypeDesc[spec.braType] ?? spec.braType}. ` +
    `Straps: ${strapDesc[spec.strapStyle] ?? spec.strapStyle}. ` +
    `Cups: ${paddingDesc[spec.padding] ?? spec.padding}. ` +
    `Construction: ${wireDesc}. ` +
    `Closure: ${closureDesc[spec.closure] ?? spec.closure}. ` +
    `Fabric: ${fabricDesc[spec.fabric] ?? spec.fabric}. ` +
    `Colour: ${spec.colorLabel}, hex ${spec.colorHex} — dye the entire garment this exact tone. ` +
    `Photoreal fabric texture, visible stitching, precise metal hardware. ` +
    `Editorial catalogue still-life, Celine / The Row, high detail, sharp focus. ` +
    `No text, no logo, no watermark, no extra props. Isolated bra only.`
  )
}

/**
 * Short visual-first prompt for Pollinations.ai (≤480 chars encoded).
 * Lead with colour + bra shape — the most visually discriminating cues.
 * Pollinations FLUX model can follow concise fashion-photography language well.
 */
export function buildPollinationsPrompt(spec: BuilderVisualSpec): string {
  const braShort: Record<string, string> = {
    everyday:   'smooth T-shirt bra with rounded seamless cups',
    balconette: 'balconette bra with straight-across cup neckline',
    padded:     'push-up bra with deep plunge padded cups',
    sports:     'structured sports bra with compression panels',
    lace:       'delicate sheer lace bra with scalloped trim',
    wirefree:   'wire-free soft-cup bra with flexible band',
    strapless:  'strapless bra with silicone grip band',
    bridal:     'bridal lace bra with satin bow at centre gore',
    tshirt:     'seamless moulded T-shirt bra',
    pushup:     'contoured push-up bra with lifted cups',
    plunge:     'deep V plunge bra with low centre gore',
    minimizer:  'full-coverage minimizer bra with broad side panels',
    bralette:   'soft unlined bralette',
    triangle:   'minimal triangle-cup bra',
    longline:   'longline bra with extended under-band',
    demi:       'demi-cup bra with open neckline',
    racerback:  'racerback bra with joined back straps',
    full:       'full-coverage bra with high cups',
  }

  const strapShort: Record<string, string> = {
    classic:     'parallel shoulder straps',
    adjustable:  'adjustable straps with metal slider',
    crossback:   'crossback X-shaped straps',
    wide:        'wide comfort shoulder straps',
    none:        'no straps strapless',
    racerback:   'racerback joined straps',
    halter:      'halter neck straps',
    convertible: 'convertible clip straps',
  }

  const fabricShort: Record<string, string> = {
    cotton:     'cotton fabric',
    silk:       'silk-satin with sheen',
    microfiber: 'matte microfiber',
    lace:       'sheer lace overlay',
    smooth:     'smooth knit',
    mesh:       'air mesh',
    velvet:     'velvet pile',
    satin:      'glossy satin',
    modal:      'soft modal knit',
  }

  const wireShort  = spec.underwire === 'wired' ? 'underwired' : 'wire-free'
  const padShort   = spec.padding === 'none' ? 'unpadded' : `${spec.padding}-padded`

  return (
    `Empty lingerie bra only, no person, no mannequin, no body. ` +
    `${spec.colorLabel} ${braShort[spec.braType] ?? spec.braType}, ` +
    `${strapShort[spec.strapStyle] ?? spec.strapStyle}, ` +
    `${wireShort}, ${padShort}, ${fabricShort[spec.fabric] ?? spec.fabric}, ` +
    `hex ${spec.colorHex}. Flat-lay on ivory linen, studio product photo, garment isolated.`
  )
}
