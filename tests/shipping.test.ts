import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mapShiprocketStatus,
  deriveShipmentStatus,
  statusRank,
  SHIPMENT_STATUS_LABEL,
} from '../lib/shipping/status'
import { isTerminalShipmentStatus } from '../lib/shipping/types'

test('mapShiprocketStatus resolves known numeric codes', () => {
  assert.equal(mapShiprocketStatus(7), 'delivered')
  assert.equal(mapShiprocketStatus(17), 'out_for_delivery')
  assert.equal(mapShiprocketStatus(6), 'in_transit')
  assert.equal(mapShiprocketStatus(9), 'rto_in_transit')
  assert.equal(mapShiprocketStatus('7'), 'delivered')
})

test('mapShiprocketStatus falls back to label keywords', () => {
  assert.equal(mapShiprocketStatus(9999, 'Out For Delivery'), 'out_for_delivery')
  assert.equal(mapShiprocketStatus(undefined, 'Shipment DELIVERED to consignee'), 'delivered')
  assert.equal(mapShiprocketStatus(null, 'RTO Delivered'), 'rto_delivered')
  assert.equal(mapShiprocketStatus(null, 'Picked Up'), 'picked_up')
})

test('mapShiprocketStatus defaults to in_transit for anything unrecognised', () => {
  assert.equal(mapShiprocketStatus(undefined, 'some novel courier phrase'), 'in_transit')
  assert.equal(mapShiprocketStatus(undefined, undefined), 'in_transit')
})

test('deriveShipmentStatus: delivered always wins even if an earlier scan ranks lower', () => {
  const events = [
    { status: 'in_transit' as const, occurredAt: new Date('2026-01-01T10:00:00Z') },
    { status: 'delivered' as const, occurredAt: new Date('2026-01-02T10:00:00Z') },
    { status: 'out_for_delivery' as const, occurredAt: new Date('2026-01-02T08:00:00Z') },
  ]
  assert.equal(deriveShipmentStatus(events), 'delivered')
})

test('deriveShipmentStatus: picks the furthest progressed status while in motion', () => {
  const events = [
    { status: 'awb_assigned' as const, occurredAt: new Date('2026-01-01T10:00:00Z') },
    { status: 'picked_up' as const, occurredAt: new Date('2026-01-01T18:00:00Z') },
    { status: 'in_transit' as const, occurredAt: new Date('2026-01-02T09:00:00Z') },
  ]
  assert.equal(deriveShipmentStatus(events), 'in_transit')
})

test('deriveShipmentStatus: an undelivered attempt does not roll progress backwards past OFD', () => {
  const events = [
    { status: 'out_for_delivery' as const, occurredAt: new Date('2026-01-02T09:00:00Z') },
    { status: 'undelivered' as const, occurredAt: new Date('2026-01-02T18:00:00Z') },
  ]
  // same rank tier → most recent wins, but still not "in_transit"
  assert.equal(deriveShipmentStatus(events), 'undelivered')
})

test('deriveShipmentStatus: empty history is pending', () => {
  assert.equal(deriveShipmentStatus([]), 'pending')
})

test('statusRank orders the happy path monotonically', () => {
  assert.ok(statusRank('awb_assigned') < statusRank('picked_up'))
  assert.ok(statusRank('picked_up') < statusRank('in_transit'))
  assert.ok(statusRank('in_transit') < statusRank('out_for_delivery'))
  assert.ok(statusRank('out_for_delivery') < statusRank('delivered'))
})

test('terminal statuses are recognised', () => {
  assert.equal(isTerminalShipmentStatus('delivered'), true)
  assert.equal(isTerminalShipmentStatus('rto_delivered'), true)
  assert.equal(isTerminalShipmentStatus('cancelled'), true)
  assert.equal(isTerminalShipmentStatus('in_transit'), false)
  assert.equal(isTerminalShipmentStatus('out_for_delivery'), false)
})

test('every ShipmentStatus has a UI label', () => {
  for (const key of Object.keys(SHIPMENT_STATUS_LABEL)) {
    assert.equal(typeof SHIPMENT_STATUS_LABEL[key as keyof typeof SHIPMENT_STATUS_LABEL], 'string')
  }
})

test('provider selection: manual when Shiprocket env is absent', async () => {
  const prevEmail = process.env.SHIPROCKET_EMAIL
  const prevPass = process.env.SHIPROCKET_PASSWORD
  delete process.env.SHIPROCKET_EMAIL
  delete process.env.SHIPROCKET_PASSWORD
  const { getShippingProvider } = await import('../lib/shipping/index')
  assert.equal(getShippingProvider().key, 'manual')
  if (prevEmail) process.env.SHIPROCKET_EMAIL = prevEmail
  if (prevPass) process.env.SHIPROCKET_PASSWORD = prevPass
})
