import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateBuilderPrice } from '../lib/builderPricing'
import { BUILDER_BASE_PRICE } from '../lib/coupons'
import {
  CB_BRA_TYPES,
  CB_FABRIC_OPTIONS,
  CB_STRAP_STYLES,
  CB_SUPPORT_OPTIONS,
} from '../data/builderOptions'

test('empty / junk specs fall back to the base price', () => {
  assert.equal(calculateBuilderPrice(null), BUILDER_BASE_PRICE)
  assert.equal(calculateBuilderPrice(undefined), BUILDER_BASE_PRICE)
  assert.equal(calculateBuilderPrice('nonsense'), BUILDER_BASE_PRICE)
  assert.equal(calculateBuilderPrice({}), BUILDER_BASE_PRICE)
})

test('a client-sent price is ignored; only the spec drives the total', () => {
  const spec = { braType: 'plunge', fabric: 'silk', price: 999999 }
  const braType = CB_BRA_TYPES.find((o) => o.id === 'plunge')!.price
  const fabric = CB_FABRIC_OPTIONS.find((o) => o.id === 'silk')!.price
  assert.equal(calculateBuilderPrice(spec), BUILDER_BASE_PRICE + braType + fabric)
})

test('unknown option ids contribute zero', () => {
  assert.equal(
    calculateBuilderPrice({ braType: 'made-up', fabric: 'also-fake' }),
    BUILDER_BASE_PRICE,
  )
})

test('server pricing matches the client store formula for a full spec', () => {
  // Mirror of store/builderStore.ts calculatePrice()
  const spec = {
    braType: 'pushup',
    strapStyle: 'crossback',
    support: 'high',
    fabric: 'velvet',
  }
  const expected =
    BUILDER_BASE_PRICE +
    CB_BRA_TYPES.find((o) => o.id === 'pushup')!.price +
    CB_STRAP_STYLES.find((o) => o.id === 'crossback')!.price +
    CB_SUPPORT_OPTIONS.find((o) => o.id === 'high')!.price +
    CB_FABRIC_OPTIONS.find((o) => o.id === 'velvet')!.price
  assert.equal(calculateBuilderPrice(spec), expected)
})
