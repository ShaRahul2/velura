import test from 'node:test'
import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'
import { upsertProfileFromIdentity } from '../lib/customerAuth'
import { mergeGuestCart, listCartItems, clearCart } from '../lib/cartServer'
import { mergeGuestWishlist, listWishlistIds, toggleWishlist } from '../lib/wishlistServer'
import { getCustomerOrder } from '../lib/customerOrders'

const db = new PrismaClient()

test('profile upsert defaults to customer and never reads a client role field', async () => {
  const id = `user_test_${Date.now()}`
  const created = await upsertProfileFromIdentity({
    id,
    email: 'guest@velura.test',
    fullName: 'Guest',
  })
  assert.equal(created.role, 'customer')
  const second = await upsertProfileFromIdentity({
    id,
    email: 'guest@velura.test',
    metadataRole: null,
  })
  assert.equal(second.role, 'customer')
  await db.profile.delete({ where: { id } })
})

test('server cart merge and wishlist toggle persist per profile', async () => {
  const id = `user_cart_${Date.now()}`
  await upsertProfileFromIdentity({ id, email: 'cart@velura.test' })
  await mergeGuestCart(id, [{
    id: 1,
    name: 'FeatherSoft',
    price: 899,
    qty: 1,
    size: '32B',
    emoji: '',
    images: [],
  }])
  await mergeGuestCart(id, [{
    id: 1,
    name: 'FeatherSoft',
    price: 899,
    qty: 2,
    size: '32B',
    emoji: '',
    images: [],
  }])
  const items = await listCartItems(id)
  assert.equal(items[0]?.qty, 3)
  const wish = await toggleWishlist(id, 1)
  assert.equal(wish.saved, true)
  await mergeGuestWishlist(id, [1, 2])
  const ids = await listWishlistIds(id)
  assert.ok(ids.includes(1) && ids.includes(2))
  await clearCart(id)
  await db.profile.delete({ where: { id } })
})

test('order lookup rejects another profile id', async () => {
  const owner = `user_own_${Date.now()}`
  const other = `user_oth_${Date.now()}`
  await upsertProfileFromIdentity({ id: owner, email: 'own@velura.test' })
  await upsertProfileFromIdentity({ id: other, email: 'oth@velura.test' })
  await db.order.create({
    data: {
      id: `VLR-TEST-${Date.now()}`,
      profileId: owner,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: 899,
      shipping: 0,
      total: 899,
      firstName: 'A',
      lastName: 'B',
      email: 'own@velura.test',
      phone: '9999999999',
      addressLine: '1 Atelier Lane',
      city: 'Mumbai',
      state: 'MH',
      pinCode: '400001',
      items: { create: [{ name: 'FeatherSoft', size: '32B', qty: 1, priceAtOrder: 899, productId: 1 }] },
    },
  })
  const stolen = await getCustomerOrder(other, (await db.order.findFirst({ where: { profileId: owner } }))!.id)
  assert.equal(stolen, null)
  const mine = await getCustomerOrder(owner, (await db.order.findFirst({ where: { profileId: owner } }))!.id)
  assert.equal(mine?.shipTo.city, 'Mumbai')
  await db.order.deleteMany({ where: { profileId: owner } })
  await db.profile.deleteMany({ where: { id: { in: [owner, other] } } })
})
