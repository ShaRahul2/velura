import test from 'node:test'
import assert from 'node:assert/strict'
import { canChangeRole, parseProfileRole } from '../lib/profileRole'
import { assertOrderOwner } from '../lib/customerOrders'
import { cartVariantKey, mergeCartItems } from '../lib/cartVariant'
import type { CartItem } from '../types'

const sample = (over: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  name: 'FeatherSoft',
  price: 899,
  qty: 1,
  size: '32B',
  emoji: '',
  images: [],
  ...over,
})

test('client-sent roles are ignored by the parser unless they are known', () => {
  assert.equal(parseProfileRole('admin'), 'admin')
  assert.equal(parseProfileRole('MANAGER'), 'manager')
  assert.equal(parseProfileRole('superuser'), null)
  assert.equal(parseProfileRole({ role: 'admin' }), null)
})

test('managers cannot change roles; admins cannot leave without another admin', () => {
  const manager = { id: 'u1', role: 'manager' as const, source: 'clerk' as const }
  const admin = { id: 'u2', role: 'admin' as const, source: 'clerk' as const }
  assert.equal(canChangeRole({
    actor: manager,
    targetId: 'u3',
    targetRole: 'customer',
    nextRole: 'manager',
    otherAdminCount: 1,
  }).ok, false)
  assert.equal(canChangeRole({
    actor: admin,
    targetId: 'u3',
    targetRole: 'customer',
    nextRole: 'manager',
    otherAdminCount: 1,
  }).ok, true)
  assert.equal(canChangeRole({
    actor: admin,
    targetId: admin.id,
    targetRole: 'admin',
    nextRole: 'customer',
    otherAdminCount: 0,
  }).ok, false)
  assert.equal(canChangeRole({
    actor: admin,
    targetId: admin.id,
    targetRole: 'admin',
    nextRole: 'customer',
    otherAdminCount: 1,
  }).ok, true)
})

test('guest cart merge adds quantities for the same variant and keeps distinct lines', () => {
  const server = [sample({ qty: 1 }), sample({ id: 2, name: 'NudeSense', size: '34C' })]
  const guest = [sample({ qty: 2 }), sample({ size: '34B' })]
  const merged = mergeCartItems(server, guest)
  assert.equal(merged.find((item) => item.id === 1 && item.size === '32B')?.qty, 3)
  assert.equal(merged.some((item) => item.size === '34B'), true)
  assert.notEqual(cartVariantKey(sample({ size: '32B' })), cartVariantKey(sample({ size: '34B' })))
})

test('order detail is only visible to the owning profile', () => {
  assert.equal(assertOrderOwner('user_abc', 'user_abc'), true)
  assert.equal(assertOrderOwner('user_abc', 'user_other'), false)
  assert.equal(assertOrderOwner(null, 'user_abc'), false)
})
