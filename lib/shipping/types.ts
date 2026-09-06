import type { ShipmentProvider, ShipmentStatus } from '@prisma/client'

export type { ShipmentProvider, ShipmentStatus }

/** A single courier scan, normalised across providers. */
export interface NormalizedEvent {
  status: ShipmentStatus
  code?: string
  description: string
  location?: string
  occurredAt: Date
  raw?: unknown
}

export interface CreateShipmentInput {
  orderId: string
  // Consignee
  name: string
  phone: string // 10-digit
  email: string
  addressLine: string
  city: string
  state: string
  pinCode: string
  // Parcel
  items: { name: string; sku: string; qty: number; unitPrice: number }[]
  subtotal: number
  total: number
  weightKg: number
  lengthCm: number
  breadthCm: number
  heightCm: number
  // Payment
  paymentMode: 'Prepaid' | 'COD'
  codAmount: number
  // Optional overrides
  courierId?: number
  manualAwb?: string
  manualCourier?: string
}

export interface CreateShipmentResult {
  provider: ShipmentProvider
  status: ShipmentStatus
  providerOrderId?: string
  providerShipmentId?: string
  awb?: string
  courier?: string
  labelUrl?: string
  manifestUrl?: string
  invoiceUrl?: string
  trackingUrl?: string
  estimatedDelivery?: Date | null
  pickupScheduledAt?: Date | null
  events: NormalizedEvent[]
  request?: unknown
  response?: unknown
}

export interface TrackingResult {
  status: ShipmentStatus
  courier?: string
  awb?: string
  trackingUrl?: string
  estimatedDelivery?: Date | null
  deliveredAt?: Date | null
  events: NormalizedEvent[]
}

export interface TrackingRef {
  awb?: string | null
  providerShipmentId?: string | null
}

export interface ShippingProvider {
  key: ShipmentProvider
  createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult>
  getTracking(ref: TrackingRef): Promise<TrackingResult>
  cancelShipment(ref: TrackingRef & { providerOrderId?: string | null }): Promise<void>
}

/** Statuses past which no further courier movement is expected. */
export const TERMINAL_SHIPMENT_STATUSES: ShipmentStatus[] = [
  'delivered',
  'rto_delivered',
  'cancelled',
  'lost',
]

export function isTerminalShipmentStatus(status: ShipmentStatus): boolean {
  return TERMINAL_SHIPMENT_STATUSES.includes(status)
}
