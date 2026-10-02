import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../data/products'
import { parseSizeRange } from '../lib/sizes'
import { filterShopCatalog, paginateShop, parseShopQuery, shopHref, parseShopSearchParams } from '../lib/shopQuery'
import { buildVisualSpec, buildAIPrompt, buildPollinationsPrompt, specToSeed } from '../lib/builderVisualSpec'
import { shouldBypassImageOptimizer } from '../lib/imageOptimizer'

test('panties is its own shop collection', () => {
  const panties = filterShopCatalog(products, { cat: 'panties', page: 1 })
  assert.ok(panties.length >= 5)
  assert.ok(panties.every((p) => p.cat === 'panties'))
  assert.equal(shopHref({ page: 1 }, { cat: 'panties' }), '/shop?cat=panties')
  const names = panties.map((p) => p.name)
  for (const name of ['CottonDay', 'FullBrief', 'FineCut', 'HighRise', 'EdgeLace']) {
    assert.ok(names.includes(name))
  }
  assert.deepEqual(parseSizeRange('XS–4XL'), ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'])
  assert.deepEqual(parseSizeRange('32A–32C'), ['32A', '32B', '32C'])
})

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

test('shopHref preserves filters, clears empty keys, and resets page on filter change', () => {
  const base = { cat: 'lace', support: 'High', sort: 'rating', page: 3 }
  assert.equal(shopHref(base, { cat: 'bridal' }), '/shop?cat=bridal&support=High&sort=rating')
  assert.equal(shopHref(base, { support: '' }), '/shop?cat=lace&sort=rating')
  assert.equal(shopHref(base, { page: 2 }), '/shop?cat=lace&support=High&sort=rating&page=2')
  assert.equal(shopHref({ page: 1 }, {}), '/shop')

  const parsed = parseShopSearchParams({ cat: 'everyday', page: ['2'] })
  assert.equal(parsed.cat, 'everyday')
  assert.equal(parsed.page, 2)
})

test('builder prompts insist on an empty garment and seed is stable', () => {
  const spec = buildVisualSpec({
    sizeMode: 'standard',
    band: '34',
    cup: 'B',
    braType: 'everyday',
    strapStyle: 'classic',
    padding: 'light',
    underwire: 'wired',
    closure: 'back',
    support: 'medium',
    fabric: 'cotton',
    color: 'cream',
    fitUnit: 'cm',
  })
  const full = buildAIPrompt(spec).toLowerCase()
  const short = buildPollinationsPrompt(spec).toLowerCase()
  assert.match(full, /no person/)
  assert.match(full, /everyday/)
  assert.match(short, /no person/)
  const panty = buildAIPrompt({ ...spec, garment: 'panties', pantyStyle: 'panty-lace' }).toLowerCase()
  assert.match(panty, /panties/)
  assert.match(panty, /no person/)
  assert.doesNotMatch(panty, /t-shirt bra/)
  assert.equal(specToSeed(spec), specToSeed(spec))
  assert.notEqual(specToSeed(spec, 1), specToSeed(spec, 0))
})

test('image optimizer bypasses Unsplash and keeps local files', () => {
  assert.equal(shouldBypassImageOptimizer('/images/products/feathersoft-1.jpg'), false)
  assert.equal(shouldBypassImageOptimizer('https://images.unsplash.com/photo-x'), true)
  assert.equal(shouldBypassImageOptimizer('https://res.cloudinary.com/demo/image.jpg'), false)
})
