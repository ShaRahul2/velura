import type { ShipmentStatus } from '@prisma/client'

/**
 * Shiprocket sends a numeric `shipment_status` / `current_status_id` on webhooks
 * and tracking responses. Codes are stable; the human label varies. Map the
 * numeric code first, fall back to a keyword match on the label.
 *
 * Reference: Shiprocket "Shipment Status Codes" (external API docs).
 */
const CODE_MAP: Record<number, ShipmentStatus> = {
  1: 'awb_assigned', // AWB Assigned
  2: 'awb_assigned', // Label Generated
  3: 'pickup_scheduled', // Pickup Scheduled/Generated
  4: 'pickup_scheduled', // Pickup Queued
  5: 'awb_assigned', // Manifest Generated
  6: 'in_transit', // Shipped
  7: 'delivered', // Delivered
  8: 'cancelled', // Cancelled
  9: 'rto_in_transit', // RTO Initiated
  10: 'rto_delivered', // RTO Delivered
  11: 'undelivered', // Pending / Undelivered
  12: 'lost', // Lost
  13: 'pickup_scheduled', // Pickup Error
  14: 'rto_in_transit', // RTO Acknowledged
  15: 'pickup_scheduled', // Pickup Rescheduled
  16: 'cancelled', // Cancellation Requested
  17: 'out_for_delivery', // Out For Delivery
  18: 'in_transit', // In Transit
  19: 'out_for_delivery', // Out For Delivery (alt)
  20: 'undelivered', // Undelivered (NDR)
  21: 'undelivered', // Delayed
  22: 'in_transit', // Partial Delivered
  23: 'lost', // Destroyed
  24: 'lost', // Damaged
  25: 'undelivered', // Fulfilled / Exception
  26: 'rto_in_transit', // RTO NDR
  27: 'rto_in_transit', // RTO OFD
  38: 'picked_up', // Picked Up
  42: 'picked_up', // Picked Up (alt)
}

const KEYWORD_RULES: [RegExp, ShipmentStatus][] = [
  [/rto.*deliver/i, 'rto_delivered'],
  [/rto|return to origin/i, 'rto_in_transit'],
  [/out for delivery|ofd/i, 'out_for_delivery'],
  [/delivered/i, 'delivered'],
  [/picked ?up/i, 'picked_up'],
  [/in ?transit|shipped|in-transit|dispatched|bag /i, 'in_transit'],
  [/pickup (scheduled|generated|queued|rescheduled)|manifest/i, 'pickup_scheduled'],
  [/awb|label generated/i, 'awb_assigned'],
  [/undelivered|ndr|not delivered|delay|exception|hold/i, 'undelivered'],
  [/cancel/i, 'cancelled'],
  [/lost|destroyed|damaged/i, 'lost'],
]

export function mapShiprocketStatus(
  code: number | string | null | undefined,
  label?: string | null,
): ShipmentStatus {
  const num = typeof code === 'string' ? Number(code) : code
  if (typeof num === 'number' && Number.isFinite(num) && CODE_MAP[num]) {
    return CODE_MAP[num]
  }
  if (label) {
    for (const [re, status] of KEYWORD_RULES) {
      if (re.test(label)) return status
    }
  }
  return 'in_transit'
}

/** Rank used to decide whether an incoming event advances the shipment. */
const RANK: Record<ShipmentStatus, number> = {
  pending: 0,
  awb_assigned: 1,
  pickup_scheduled: 2,
  picked_up: 3,
  in_transit: 4,
  out_for_delivery: 5,
  undelivered: 5, // same tier as OFD — a failed attempt, not backwards progress
  delivered: 9,
  rto_in_transit: 6,
  rto_delivered: 9,
  cancelled: 9,
  lost: 9,
}

export function statusRank(status: ShipmentStatus): number {
  return RANK[status] ?? 0
}

/**
 * Pick the shipment's current status from its event history. Delivered / RTO /
 * cancelled / lost win outright; otherwise the furthest-progressed status.
 */
export function deriveShipmentStatus(
  events: { status: ShipmentStatus; occurredAt: Date }[],
): ShipmentStatus {
  if (events.length === 0) return 'pending'
  const finality: ShipmentStatus[] = ['delivered', 'rto_delivered', 'cancelled', 'lost']
  for (const f of finality) {
    if (events.some((e) => e.status === f)) return f
  }
  return events.reduce<ShipmentStatus>((best, e) => {
    if (statusRank(e.status) > statusRank(best)) return e.status
    if (statusRank(e.status) === statusRank(best)) {
      // tie → most recent wins
      const bestAt = events.filter((x) => x.status === best).at(-1)?.occurredAt ?? new Date(0)
      return e.occurredAt >= bestAt ? e.status : best
    }
    return best
  }, 'pending')
}

/** Human label for admin + customer UI. */
export const SHIPMENT_STATUS_LABEL: Record<ShipmentStatus, string> = {
  pending: 'Preparing',
  awb_assigned: 'Label ready',
  pickup_scheduled: 'Pickup scheduled',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  undelivered: 'Delivery attempted',
  rto_in_transit: 'Returning to us',
  rto_delivered: 'Return received',
  cancelled: 'Cancelled',
  lost: 'Lost in transit',
}
