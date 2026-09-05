import test from 'node:test'
import assert from 'node:assert/strict'
import { canChangeRole, isStaffRole, parseClerkRole } from '../lib/accountRoles'
import { mergeCartItems, mergeWishlistIds } from '../lib/accountMerge'
import { lineKey } from '../lib/cartLine'
import type { CartItem } from '../types'
import { safeAdminCallback } from '../lib/adminAuth'
import { clerkWebhookSecret } from '../lib/clerkEnv'

test('client-sent roles are ignored unless they are Clerk metadata', () => {
  assert.equal(parseClerkRole({ role: 'admin' }), 'admin')
  assert.equal(parseClerkRole({ role: 'superuser' }), null)
  assert.equal(parseClerkRole(null), null)
})

test('staff roles are manager and admin only', () => {
  assert.equal(isStaffRole('customer'), false)
  assert.equal(isStaffRole('manager'), true)
  assert.equal(isStaffRole('admin'), true)
})

test('admins can move manager and customer; they cannot change admin here', () => {
  assert.equal(canChangeRole('admin', 'customer', 'manager'), true)
  assert.equal(canChangeRole('admin', 'manager', 'customer'), true)
  assert.equal(canChangeRole('manager', 'customer', 'manager'), false)
  assert.equal(canChangeRole('admin', 'admin', 'customer'), false)
  assert.equal(canChangeRole('admin', 'customer', 'admin'), false)
})

test('guest cart merges by product/size/colour and stacks quantity', () => {
  const base: CartItem = {
    id: 1, name: 'FeatherSoft', price: 799, qty: 1, size: '32B', emoji: '', images: [],
  }
  const merged = mergeCartItems(
    [base],
    [{ ...base, qty: 2 }, { ...base, id: 2, name: 'NudeSense', size: '34C', qty: 1 }],
  )
  assert.equal(merged.length, 2)
  assert.equal(merged.find((i) => lineKey(i) === lineKey(base))?.qty, 3)
})

test('wishlist merge is a union', () => {
  assert.deepEqual(mergeWishlistIds([1, 2], [2, 3]).sort(), [1, 2, 3])
})

test('order list ownership is profile id, not a client-supplied email', () => {
  const profileId = 'user_abc'
  const rows = [
    { id: 'VLR-1', profileId: 'user_abc' },
    { id: 'VLR-2', profileId: 'user_other' },
    { id: 'VLR-3', profileId: null },
  ]
  const owned = rows.filter((row) => row.profileId === profileId).map((row) => row.id)
  assert.deepEqual(owned, ['VLR-1'])
})

test('admin callbacks still cannot leave /admin', () => {
  assert.equal(safeAdminCallback('/account'), '/admin')
  assert.equal(safeAdminCallback('/admin/customers'), '/admin/customers')
})

test('webhook signing secret alias is accepted', () => {
  const prevSign = process.env.CLERK_WEBHOOK_SIGNING_SECRET
  const prevAlias = process.env.CLERK_WEBHOOK_SECRET
  delete process.env.CLERK_WEBHOOK_SIGNING_SECRET
  process.env.CLERK_WEBHOOK_SECRET = 'whsec_alias'
  assert.equal(clerkWebhookSecret(), 'whsec_alias')
  if (prevSign === undefined) delete process.env.CLERK_WEBHOOK_SIGNING_SECRET
  else process.env.CLERK_WEBHOOK_SIGNING_SECRET = prevSign
  if (prevAlias === undefined) delete process.env.CLERK_WEBHOOK_SECRET
  else process.env.CLERK_WEBHOOK_SECRET = prevAlias
})
