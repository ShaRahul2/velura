import type { BuilderState } from '@/types'
import { CB_COLOR_OPTIONS } from '@/data/builderOptions'

/**
 * Normalised view-model derived from BuilderState.
 * Used by both the deterministic SVG renderer (BraSVG) and the AI prompt builder.
 * All nulls are resolved to sensible defaults so downstream code never needs to guard.
 */
export interface BuilderVisualSpec {
  braType:    string   // everyday | balconette | padded | sports | lace | wirefree | strapless | bridal
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
  }

  // ── Straps — describe how they look and connect ─────────────────────────────
  const strapDesc: Record<string, string> = {
    classic:    'thin classic parallel shoulder straps',
    adjustable: 'adjustable shoulder straps with sliding metal hardware rings',
    crossback:  'straps that cross diagonally at the back to form a clear X shape, each strap running from the cup on one side to the shoulder on the opposite side',
    wide:       'broad padded comfort shoulder straps, approximately 3cm wide',
    none:       'no shoulder straps, fully strapless silhouette',
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
    `Minimalist editorial product photograph of a single lingerie bra, flat-lay arrangement ` +
    `on warm ivory linen surface. Soft studio key light from upper-left, gentle fill from right, ` +
    `no harsh shadows. ` +
    `The bra is: a ${braTypeDesc[spec.braType] ?? spec.braType}. ` +
    `Straps: ${strapDesc[spec.strapStyle] ?? spec.strapStyle}. ` +
    `Cups: ${paddingDesc[spec.padding] ?? spec.padding}. ` +
    `Construction: ${wireDesc}. ` +
    `Closure: ${closureDesc[spec.closure] ?? spec.closure}. ` +
    `Fabric: ${fabricDesc[spec.fabric] ?? spec.fabric}. ` +
    `Colour: ${spec.colorLabel} (exact hex ${spec.colorHex}) — render the fabric in this exact colour tone. ` +
    `Show photorealistic fabric texture, visible stitching and seams, precise hardware detail. ` +
    `Celine / The Row aesthetic: minimal, refined, nothing excessive. ` +
    `Absolutely no person, no human body, no skin, no face, no mannequin. ` +
    `No text overlays, no logo, no watermark, no background props. Garment only.`
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
  }

  const strapShort: Record<string, string> = {
    classic:    'parallel shoulder straps',
    adjustable: 'adjustable straps with metal slider',
    crossback:  'crossback X-shaped straps',
    wide:       'wide comfort shoulder straps',
    none:       'no straps strapless',
  }

  const fabricShort: Record<string, string> = {
    cotton:     'cotton fabric',
    silk:       'silk-satin with sheen',
    microfiber: 'matte microfiber',
    lace:       'sheer lace overlay',
    smooth:     'smooth knit',
  }

  const wireShort  = spec.underwire === 'wired' ? 'underwired' : 'wire-free'
  const padShort   = spec.padding === 'none' ? 'unpadded' : `${spec.padding}-padded`

  return (
    `${spec.colorLabel} ${braShort[spec.braType] ?? spec.braType}, ` +
    `${strapShort[spec.strapStyle] ?? spec.strapStyle}, ` +
    `${wireShort}, ${padShort}, ${fabricShort[spec.fabric] ?? spec.fabric}. ` +
    `Flat-lay on ivory linen, editorial product photo, studio light, no people, garment only.`
  )
}
