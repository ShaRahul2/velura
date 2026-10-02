import type { Order, OrderItem, Shipment } from '@prisma/client'
import { db } from '@/lib/db'
import { notifyOrder } from '@/lib/notify'
import type {
  CreateShipmentInput,
  NormalizedEvent,
  ShippingProvider,
} from './types'
import { isTerminalShipmentStatus } from './types'
import { deriveShipmentStatus } from './status'
import { isShiprocketConfigured, shiprocketProvider } from './shiprocket'
import { manualProvider } from './manual'

export * from './types'
export { SHIPMENT_STATUS_LABEL, deriveShipmentStatus, mapShiprocketStatus } from './status'
export { isShiprocketConfigured } from './shiprocket'

const DEFAULT_WEIGHT_KG = Number(process.env.SHIPPING_DEFAULT_WEIGHT_KG || 0.3)
const [BOX_L, BOX_B, BOX_H] = (process.env.SHIPPING_BOX_CM || '15x12x5')
  .split('x')
  .map((n) => Number(n) || 10)

export function getShippingProvider(): ShippingProvider {
  return isShiprocketConfigured() ? shiprocketProvider : manualProvider
}

export function shippingProviderKey(): 'shiprocket' | 'manual' {
  return getShippingProvider().key
}

function toCreateInput(
  order: Order & { items: OrderItem[] },
  opts: { weightKg?: number; courierId?: number; manualAwb?: string; manualCourier?: string },
): CreateShipmentInput {
  const units = order.items.reduce((n, it) => n + it.qty, 0) || 1
  return {
    orderId: order.id,
    name: `${order.firstName} ${order.lastName}`.trim(),
    phone: order.phone,
    email: order.email,
    addressLine: order.addressLine,
    city: order.city,
    state: order.state,
    pinCode: order.pinCode,
    items: order.items.map((it) => ({
      name: it.name,
      sku: it.productId != null ? `VLR-${it.productId}-${it.size}` : `VLR-CUSTOM-${it.id}`,
      qty: it.qty,
      unitPrice: it.priceAtOrder,
    })),
    subtotal: order.subtotal,
    total: order.total,
    weightKg: opts.weightKg && opts.weightKg > 0 ? opts.weightKg : Math.max(0.05, DEFAULT_WEIGHT_KG * units),
    lengthCm: BOX_L,
    breadthCm: BOX_B,
    heightCm: BOX_H,
    paymentMode: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    codAmount: order.paymentMethod === 'cod' ? order.total : 0,
    courierId: opts.courierId,
    manualAwb: opts.manualAwb,
    manualCourier: opts.manualCourier,
  }
}

export class ShipmentError extends Error {
  constructor(
    message: string,
    readonly status = 422,
  ) {
    super(message)
    this.name = 'ShipmentError'
  }
}

/**
 * Book the parcel for an order. Idempotent-ish: refuses if a live shipment
 * already exists. Sets Order.status → shipped and mirrors carrier/AWB so the
 * existing order UI + emails keep working unchanged.
 */
export async function createShipmentForOrder(
  orderId: string,
  opts: { weightKg?: number; courierId?: number; manualAwb?: string; manualCourier?: string } = {},
): Promise<Shipment> {
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true, shipment: true } })
  if (!order) throw new ShipmentError('Order not found', 404)
  if (order.shipment && order.shipment.status !== 'cancelled') {
    throw new ShipmentError('A shipment already exists for this order.', 409)
  }
  if (order.status === 'cancelled' || order.status === 'returned') {
    throw new ShipmentError('This order is closed.', 422)
  }
  if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'paid') {
    throw new ShipmentError('Payment is not captured yet.', 422)
  }

  const provider = getShippingProvider()
  const input = toCreateInput(order, opts)
  const res = await provider.createShipment(input)

  const shipment = await db.$transaction(async (tx) => {
    const created = await tx.shipment.upsert({
      where: { orderId },
      create: {
        orderId,
        provider: res.provider,
        status: res.status,
        providerOrderId: res.providerOrderId,
        providerShipmentId: res.providerShipmentId,
        awb: res.awb,
        courier: res.courier,
        labelUrl: res.labelUrl,
        manifestUrl: res.manifestUrl,
        invoiceUrl: res.invoiceUrl,
        trackingUrl: res.trackingUrl,
        weightKg: input.weightKg,
        estimatedDelivery: res.estimatedDelivery ?? undefined,
        pickupScheduledAt: res.pickupScheduledAt ?? undefined,
        createRequest: (res.request ?? undefined) as object | undefined,
        createResponse: (res.response ?? undefined) as object | undefined,
        lastSyncedAt: new Date(),
      },
      update: {
        provider: res.provider,
        status: res.status,
        providerOrderId: res.providerOrderId,
        providerShipmentId: res.providerShipmentId,
        awb: res.awb,
        courier: res.courier,
        labelUrl: res.labelUrl,
        trackingUrl: res.trackingUrl,
        weightKg: input.weightKg,
        createResponse: (res.response ?? undefined) as object | undefined,
        lastSyncedAt: new Date(),
      },
    })

    await insertEvents(tx, created.id, res.events)

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: order.status === 'pending' || order.status === 'confirmed' ? 'shipped' : order.status,
        carrier: res.courier ?? order.carrier,
        trackingNumber: res.awb ?? order.trackingNumber,
      },
    })
    return created
  })

  void notifyOrder(orderId, 'shipped')
  return shipment
}

type Tx = Parameters<Parameters<typeof db.$transaction>[0]>[0]

async function insertEvents(tx: Tx, shipmentId: string, events: NormalizedEvent[]): Promise<number> {
  if (events.length === 0) return 0
  // Collapse duplicate (status, occurredAt) tuples within this batch — the
  // webhook's synthetic "top" event frequently mirrors a scan.
  const seen = new Set<string>()
  const rows = events
    .filter((ev) => {
      const key = `${ev.status}|${ev.occurredAt.getTime()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((ev) => ({
      shipmentId,
      status: ev.status,
      code: ev.code,
      description: ev.description.slice(0, 300),
      location: ev.location?.slice(0, 160),
      occurredAt: ev.occurredAt,
      raw: (ev.raw ?? undefined) as object | undefined,
    }))
  // ON CONFLICT DO NOTHING against @@unique([shipmentId,status,occurredAt]).
  // Catching a unique violation mid-transaction would poison it (Postgres 25P02).
  const result = await tx.shipmentEvent.createMany({ data: rows, skipDuplicates: true })
  return result.count
}

/**
 * Pull fresh tracking for one shipment and fold in any new scans. Advances
 * Shipment.status, closes the Order on delivery, and fires milestone
 * notifications exactly once each.
 */
export async function syncShipmentTracking(shipmentId: string): Promise<Shipment> {
  const shipment = await db.shipment.findUnique({ where: { id: shipmentId } })
  if (!shipment) throw new ShipmentError('Shipment not found', 404)

  const provider = getShippingProvider()
  let pulledEvents: NormalizedEvent[] = []
  let pulled: Awaited<ReturnType<ShippingProvider['getTracking']>> | null = null
  try {
    pulled = await provider.getTracking({ awb: shipment.awb, providerShipmentId: shipment.providerShipmentId })
    pulledEvents = pulled.events
  } catch {
    // leave events untouched, just stamp the attempt
  }

  return applyTrackingUpdate(shipmentId, pulledEvents, {
    courier: pulled?.courier,
    trackingUrl: pulled?.trackingUrl,
    estimatedDelivery: pulled?.estimatedDelivery ?? undefined,
    deliveredAt: pulled?.deliveredAt ?? undefined,
    fallbackStatus: pulled?.status,
  })
}

/** Shared by the poller and the webhook. */
export async function applyTrackingUpdate(
  shipmentId: string,
  events: NormalizedEvent[],
  meta: {
    courier?: string
    trackingUrl?: string
    estimatedDelivery?: Date | null
    deliveredAt?: Date | null
    fallbackStatus?: import('./types').ShipmentStatus
  } = {},
): Promise<Shipment> {
  const { shipment, orderId } = await db.$transaction(async (tx) => {
    const current = await tx.shipment.findUnique({ where: { id: shipmentId } })
    if (!current) throw new ShipmentError('Shipment not found', 404)

    await insertEvents(tx, shipmentId, events)
    const allEvents = await tx.shipmentEvent.findMany({
      where: { shipmentId },
      orderBy: { occurredAt: 'asc' },
      select: { status: true, occurredAt: true },
    })

    const derived = allEvents.length > 0 ? deriveShipmentStatus(allEvents) : (meta.fallbackStatus ?? current.status)

    const updated = await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: derived,
        courier: meta.courier ?? current.courier,
        trackingUrl: meta.trackingUrl ?? current.trackingUrl,
        estimatedDelivery: meta.estimatedDelivery ?? current.estimatedDelivery,
        deliveredAt:
          derived === 'delivered'
            ? (meta.deliveredAt ?? current.deliveredAt ?? new Date())
            : current.deliveredAt,
        lastSyncedAt: new Date(),
      },
    })

    // Keep the coarse Order.status in step
    if (derived === 'delivered') {
      await tx.order.updateMany({
        where: { id: current.orderId, status: { in: ['confirmed', 'shipped'] } },
        data: { status: 'delivered' },
      })
    } else if (
      ['in_transit', 'out_for_delivery', 'picked_up', 'pickup_scheduled', 'awb_assigned'].includes(derived)
    ) {
      await tx.order.updateMany({
        where: { id: current.orderId, status: { in: ['pending', 'confirmed'] } },
        data: { status: 'shipped' },
      })
    }

    return { shipment: updated, orderId: current.orderId }
  })

  await fireMilestoneNotifications(shipmentId, orderId)
  return shipment
}

async function fireMilestoneNotifications(shipmentId: string, orderId: string): Promise<void> {
  const s = await db.shipment.findUnique({ where: { id: shipmentId } })
  if (!s) return
  const rank = statusReached(s.status)

  if (rank >= statusReached('out_for_delivery') && rank < statusReached('delivered') && !s.notifiedOutForDelivery) {
    await db.shipment.update({ where: { id: shipmentId }, data: { notifiedOutForDelivery: new Date() } })
    void notifyOrder(orderId, 'out_for_delivery')
  }
  if (s.status === 'delivered' && !s.notifiedDelivered) {
    await db.shipment.update({ where: { id: shipmentId }, data: { notifiedDelivered: new Date() } })
    void notifyOrder(orderId, 'delivered')
  }
}

function statusReached(status: import('./types').ShipmentStatus): number {
  const order: import('./types').ShipmentStatus[] = [
    'pending',
    'awb_assigned',
    'pickup_scheduled',
    'picked_up',
    'in_transit',
    'out_for_delivery',
    'delivered',
  ]
  const i = order.indexOf(status)
  return i === -1 ? 0 : i
}

export async function cancelShipmentForOrder(orderId: string): Promise<void> {
  const s = await db.shipment.findUnique({ where: { orderId } })
  if (!s) throw new ShipmentError('No shipment on this order.', 404)
  if (isTerminalShipmentStatus(s.status) && s.status !== 'cancelled') {
    throw new ShipmentError('Shipment already completed — cannot cancel.', 422)
  }
  await getShippingProvider().cancelShipment({
    awb: s.awb,
    providerShipmentId: s.providerShipmentId,
    providerOrderId: s.providerOrderId,
  })
  await db.shipment.update({ where: { id: s.id }, data: { status: 'cancelled', lastSyncedAt: new Date() } })
  await db.shipmentEvent.create({
    data: {
      shipmentId: s.id,
      status: 'cancelled',
      description: 'Shipment cancelled.',
      occurredAt: new Date(),
    },
  }).catch(() => undefined)
}

/** Poller: shipments still in motion, least-recently synced first. */
export async function dueForSync(limit = 40): Promise<{ id: string }[]> {
  return db.shipment.findMany({
    where: {
      status: { notIn: ['delivered', 'rto_delivered', 'cancelled', 'lost', 'pending'] },
      provider: 'shiprocket',
    },
    orderBy: { lastSyncedAt: 'asc' },
    take: limit,
    select: { id: true },
  })
}
