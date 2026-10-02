import {
  CB_BRA_TYPES,
  CB_CLOSURE_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_PADDING_OPTIONS,
  CB_PANTY_STYLES,
  CB_STRAP_STYLES,
  CB_SUPPORT_OPTIONS,
  CB_UNDERWIRE_OPTIONS,
} from '@/data/builderOptions'
import { BUILDER_BASE_PRICE, PANTY_BASE_PRICE } from '@/lib/coupons'

// Server-authoritative mirror of store/builderStore.ts calculatePrice().
// Keep these two in sync — a test in tests/ pins them together.
const PRICE_MAP = new Map<string, number>([
  ...CB_BRA_TYPES,
  ...CB_STRAP_STYLES,
  ...CB_PADDING_OPTIONS,
  ...CB_UNDERWIRE_OPTIONS,
  ...CB_CLOSURE_OPTIONS,
  ...CB_SUPPORT_OPTIONS,
  ...CB_FABRIC_OPTIONS,
  ...CB_PANTY_STYLES,
].map((o): [string, number] => [o.id, o.price]))

const PRICED_KEYS = [
  'braType',
  'strapStyle',
  'padding',
  'underwire',
  'closure',
  'support',
  'fabric',
] as const

function optionId(spec: Record<string, unknown>, key: string): string | null {
  const v = spec[key]
  return typeof v === 'string' ? v : null
}

const PANTY_PRICED_KEYS = ['pantyStyle', 'fabric'] as const

/**
 * Recompute a custom garment price from its spec, ignoring any client-sent price.
 * A missing garment is a bra, so older orders keep the bra base.
 * Unknown option ids contribute 0.
 */
export function calculateBuilderPrice(customSpec: unknown): number {
  if (!customSpec || typeof customSpec !== 'object') return BUILDER_BASE_PRICE
  const spec = customSpec as Record<string, unknown>
  if (spec.garment === 'panties') {
    let total = PANTY_BASE_PRICE
    for (const key of PANTY_PRICED_KEYS) {
      const id = optionId(spec, key)
      if (id) total += PRICE_MAP.get(id) ?? 0
    }
    return total
  }
  let total = BUILDER_BASE_PRICE
  for (const key of PRICED_KEYS) {
    const id = optionId(spec, key)
    if (id) total += PRICE_MAP.get(id) ?? 0
  }
  return total
}
