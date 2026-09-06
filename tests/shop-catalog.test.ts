import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../data/products'
import { filterShopCatalog, paginateShop, parseShopQuery } from '../lib/shopQuery'
import { shouldBypassImageOptimizer } from '../lib/imageOptimizer'

test('shop catalog filters by category, support, and search', () => {
  const everyday = filterShopCatalog(products, { cat: 'everyday', page: 1 })
  assert.ok(everyday.length > 0)
  assert.ok(everyday.every((p) => p.cat === 'everyday'))

  const high = filterShopCatalog(products, { support: 'High', page: 1 })
  assert.ok(high.every((p) => p.support === 'High'))

  const laceSearch = filterShopCatalog(products, { q: 'lace', page: 1 })
  assert.ok(laceSearch.length > 0)
})

test('shop sort orders price and new arrivals', () => {
  const asc = filterShopCatalog(products, { sort: 'price-asc', page: 1 })
  for (let i = 1; i < asc.length; i++) {
    assert.ok(asc[i].price >= asc[i - 1].price)
  }
  const newest = filterShopCatalog(products, { sort: 'new', page: 1 })
  const firstNew = newest.findIndex((p) => p.badge === 'New')
  const firstOther = newest.findIndex((p) => p.badge !== 'New')
  if (firstNew !== -1 && firstOther !== -1) assert.ok(firstNew < firstOther)
})

test('shop pagination slices twelve items and clamps the page', () => {
  const all = filterShopCatalog(products, { page: 1 })
  const page1 = paginateShop(all, 1, 12)
  assert.equal(page1.data.length, Math.min(12, all.length))
  assert.equal(page1.total, all.length)
  const overflow = paginateShop(all, 99, 12)
  assert.equal(overflow.page, overflow.totalPages)
})

test('shop query parser ignores junk and empty search', () => {
  const q = parseShopQuery(new URLSearchParams('page=-2&q=%20&cat=everyday'))
  assert.equal(q.page, 1)
  assert.equal(q.q, undefined)
  assert.equal(q.cat, 'everyday')
})

test('image optimizer bypasses Unsplash and keeps local files', () => {
  assert.equal(shouldBypassImageOptimizer('/images/products/feathersoft-1.jpg'), false)
  assert.equal(shouldBypassImageOptimizer('https://images.unsplash.com/photo-x'), true)
  assert.equal(shouldBypassImageOptimizer('https://res.cloudinary.com/demo/image.jpg'), false)
})
