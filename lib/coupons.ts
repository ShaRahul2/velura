export const FREE_SHIPPING_THRESHOLD = 999
export const SHIPPING_COST           = 79
export const COD_LIMIT               = 5000
export const BUILDER_BASE_PRICE      = 999

export const COUPONS: Record<string, { type: 'pct' | 'flat'; value: number }> = {
  VELURA10: { type: 'pct',  value: 0.10 },
  FIRST50:  { type: 'flat', value: 50   },
}

export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}

export function calcDiscount(code: string | null | undefined, subtotal: number): number {
  if (!code) return 0
  const coupon = COUPONS[code.toUpperCase()]
  if (!coupon) return 0
  return coupon.type === 'pct'
    ? Math.round(subtotal * coupon.value)
    : Math.min(coupon.value, subtotal)
}
