import test from 'node:test'
import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'
import { upsertProfileFromClerk } from '../lib/profiles'
import { cartItemsForProfile, clearCart, mergeGuestCart, mergeGuestWishlist, toggleWishlist, wishlistIdsForProfile } from '../lib/accountCommerce'

const db = new PrismaClient()

function skipWithoutDb() {
  if (!process.env.DATABASE_URL) {
    test('account db tests skipped without DATABASE_URL', () => {
      assert.ok(true)
    })
    return true
  }
  return false
}

if (!skipWithoutDb()) {
  test('profile upsert defaults to customer and ignores a missing Clerk role', async () => {
    const id = `user_test_${Date.now()}`
    const created = await upsertProfileFromClerk({
      id,
      email: 'guest@velura.test',
      fullName: 'Guest',
    })
    assert.equal(created.role, 'customer')
    const second = await upsertProfileFromClerk({
      id,
      email: 'guest@velura.test',
      role: null,
    })
    assert.equal(second.role, 'customer')
    await db.profile.delete({ where: { id } })
  })

  test('server cart merge and wishlist toggle persist per profile', async () => {
    const id = `user_cart_${Date.now()}`
    await upsertProfileFromClerk({ id, email: 'cart@velura.test' })
    const line = {
      id: 1,
      name: 'FeatherSoft',
      price: 899,
      qty: 1,
      size: '32B',
      emoji: '',
      images: [],
    }
    await mergeGuestCart(id, [line])
    await mergeGuestCart(id, [{ ...line, qty: 2 }])
    const items = await cartItemsForProfile(id)
    assert.equal(items[0]?.qty, 3)
    const wish = await toggleWishlist(id, 1)
    assert.equal(wish.wishlisted, true)
    await mergeGuestWishlist(id, [1, 2])
    const ids = await wishlistIdsForProfile(id)
    assert.ok(ids.includes(1) && ids.includes(2))
    await clearCart(id)
    await db.profile.delete({ where: { id } })
  })

  test('order lookup rejects another profile id', async () => {
    const owner = `user_own_${Date.now()}`
    const other = `user_oth_${Date.now()}`
    await upsertProfileFromClerk({ id: owner, email: 'own@velura.test' })
    await upsertProfileFromClerk({ id: other, email: 'oth@velura.test' })
    const orderId = `VLR-TEST-${Date.now()}`
    await db.order.create({
      data: {
        id: orderId,
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
    const stolen = await db.order.findFirst({ where: { id: orderId, profileId: other } })
    assert.equal(stolen, null)
    const mine = await db.order.findFirst({ where: { id: orderId, profileId: owner } })
    assert.equal(mine?.city, 'Mumbai')
    await db.order.deleteMany({ where: { profileId: owner } })
    await db.profile.deleteMany({ where: { id: { in: [owner, other] } } })
  })
}
