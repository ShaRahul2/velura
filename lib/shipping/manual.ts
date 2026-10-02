import type {
  CreateShipmentInput,
  CreateShipmentResult,
  ShippingProvider,
  TrackingRef,
  TrackingResult,
} from './types'

/**
 * No aggregator. The admin books the courier out-of-band, types the AWB +
 * courier name into the panel, and advances the status by hand from the order
 * actions. getTracking is a no-op (nothing to poll).
 */
export async function createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
  const awb = input.manualAwb?.trim() || undefined
  const courier = input.manualCourier?.trim() || undefined
  return {
    provider: 'manual',
    status: awb ? 'awb_assigned' : 'pending',
    awb,
    courier,
    trackingUrl: undefined,
    events: [
      {
        status: awb ? 'awb_assigned' : 'pending',
        description: awb ? `Booked with ${courier ?? 'courier'}. AWB ${awb}.` : 'Shipment opened.',
        occurredAt: new Date(),
      },
    ],
  }
}

export async function getTracking(_ref: TrackingRef): Promise<TrackingResult> {
  void _ref
  return { status: 'pending', events: [] }
}

export async function cancelShipment(): Promise<void> {
  /* nothing to call */
}

export const manualProvider: ShippingProvider = {
  key: 'manual',
  createShipment,
  getTracking,
  cancelShipment,
}
