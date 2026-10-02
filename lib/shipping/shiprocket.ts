import type {
  CreateShipmentInput,
  CreateShipmentResult,
  NormalizedEvent,
  ShippingProvider,
  TrackingRef,
  TrackingResult,
} from './types'
import { mapShiprocketStatus } from './status'

const BASE_URL = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external'
const PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary'

export function isShiprocketConfigured(): boolean {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD)
}

// ── Token cache (module memory; re-login on 401) ─────────────────────────────
let cachedToken: { value: string; expiresAt: number } | null = null

async function login(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
    cache: 'no-store',
  })
  const json = (await res.json().catch(() => ({}))) as { token?: string; message?: string }
  if (!res.ok || !json.token) {
    throw new Error(`Shiprocket auth failed: ${json.message || res.status}`)
  }
  cachedToken = { value: json.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 }
  return json.token
}

async function token(force = false): Promise<string> {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value
  return login()
}

async function call<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown; query?: Record<string, string> } = {},
  retry = true,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v)

  const res = await fetch(url, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
    },
    body: init.body != null ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  })

  if ((res.status === 401 || res.status === 403) && retry) {
    cachedToken = null
    await token(true)
    return call<T>(path, init, false)
  }

  const text = await res.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    const msg =
      (json as { message?: string; error?: string })?.message ||
      (json as { error?: string })?.error ||
      `Shiprocket ${res.status}`
    throw new Error(msg)
  }
  return json as T
}

// ── create ──────────────────────────────────────────────────────────────────
export async function createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
  const request = {
    order_id: input.orderId,
    order_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    pickup_location: PICKUP_LOCATION,
    channel_id: process.env.SHIPROCKET_CHANNEL_ID || undefined,
    billing_customer_name: input.name.split(' ')[0] || input.name,
    billing_last_name: input.name.split(' ').slice(1).join(' ') || '',
    billing_address: input.addressLine,
    billing_city: input.city,
    billing_pincode: input.pinCode,
    billing_state: input.state,
    billing_country: 'India',
    billing_email: input.email,
    billing_phone: input.phone,
    shipping_is_billing: true,
    order_items: input.items.map((it) => ({
      name: it.name.slice(0, 120),
      sku: it.sku,
      units: it.qty,
      selling_price: it.unitPrice,
    })),
    payment_method: input.paymentMode,
    sub_total: input.subtotal,
    length: input.lengthCm,
    breadth: input.breadthCm,
    height: input.heightCm,
    weight: input.weightKg,
  }

  const created = await call<{
    order_id?: number | string
    shipment_id?: number | string
    status?: string
    status_code?: number
  }>('/orders/create/adhoc', { method: 'POST', body: request })

  const providerOrderId = created.order_id != null ? String(created.order_id) : undefined
  const providerShipmentId = created.shipment_id != null ? String(created.shipment_id) : undefined

  const result: CreateShipmentResult = {
    provider: 'shiprocket',
    status: 'pending',
    providerOrderId,
    providerShipmentId,
    events: [],
    request,
    response: { create: created },
  }

  if (!providerShipmentId) return result

  // Assign AWB — best effort. Sandbox / no-balance accounts often fail here;
  // keep the order so an admin can retry from the panel.
  try {
    const awbRes = await call<{
      response?: {
        data?: {
          awb_code?: string
          courier_name?: string
          courier_company_id?: number
        }
      }
    }>('/courier/assign/awb', {
      method: 'POST',
      body: { shipment_id: providerShipmentId, ...(input.courierId ? { courier_id: input.courierId } : {}) },
    })
    const data = awbRes.response?.data
    if (data?.awb_code) {
      result.awb = data.awb_code
      result.courier = data.courier_name
      result.status = 'awb_assigned'
      result.trackingUrl = `https://shiprocket.co/tracking/${data.awb_code}`
    }
    result.response = { ...(result.response as object), awb: awbRes }
  } catch (err) {
    result.response = {
      ...(result.response as object),
      awbError: err instanceof Error ? err.message : String(err),
    }
  }

  // Schedule pickup + label — best effort, only once AWB exists
  if (result.awb) {
    try {
      const pickup = await call<{
        response?: { pickup_scheduled_date?: string; pickup_token_number?: string }
      }>('/courier/generate/pickup', { method: 'POST', body: { shipment_id: [providerShipmentId] } })
      const when = pickup.response?.pickup_scheduled_date
      if (when) {
        result.status = 'pickup_scheduled'
        result.pickupScheduledAt = new Date(when)
      }
      result.response = { ...(result.response as object), pickup }
    } catch {
      /* pickup can be generated later */
    }
    try {
      const label = await call<{ label_url?: string }>('/courier/generate/label', {
        method: 'POST',
        body: { shipment_id: [providerShipmentId] },
      })
      if (label.label_url) result.labelUrl = label.label_url
    } catch {
      /* label can be generated later */
    }
  }

  result.events.push({
    status: result.status,
    description:
      result.status === 'pickup_scheduled'
        ? 'Pickup scheduled with the courier.'
        : result.awb
          ? 'Shipping label created.'
          : 'Shipment registered with Shiprocket.',
    occurredAt: new Date(),
  })

  return result
}

// ── tracking ────────────────────────────────────────────────────────────────
export async function getTracking(ref: TrackingRef): Promise<TrackingResult> {
  if (!ref.awb) {
    return { status: 'pending', events: [] }
  }
  const data = await call<{
    tracking_data?: {
      track_status?: number
      shipment_status?: number | string
      current_status?: string
      etd?: string
      track_url?: string
      shipment_track?: {
        current_status?: string
        courier_name?: string
        delivered_date?: string
        edd?: string
      }[]
      shipment_track_activities?: {
        date?: string
        status?: string
        activity?: string
        location?: string
        'sr-status'?: string | number
        'sr-status-label'?: string
      }[]
    }
  }>(`/courier/track/awb/${encodeURIComponent(ref.awb)}`)

  const td = data.tracking_data ?? {}
  const head = td.shipment_track?.[0]
  const events: NormalizedEvent[] = (td.shipment_track_activities ?? [])
    .filter((a) => a.date)
    .map((a) => ({
      status: mapShiprocketStatus(a['sr-status'], a['sr-status-label'] || a.status || a.activity),
      code: a['sr-status'] != null ? String(a['sr-status']) : undefined,
      description: a.activity || a.status || 'Update',
      location: a.location || undefined,
      occurredAt: new Date(a.date as string),
      raw: a,
    }))
    .sort((x, y) => x.occurredAt.getTime() - y.occurredAt.getTime())

  const status =
    events.at(-1)?.status ??
    mapShiprocketStatus(td.shipment_status, td.current_status || head?.current_status)

  return {
    status,
    courier: head?.courier_name,
    awb: ref.awb,
    trackingUrl: td.track_url || `https://shiprocket.co/tracking/${ref.awb}`,
    estimatedDelivery: td.etd || head?.edd ? new Date((td.etd || head?.edd) as string) : null,
    deliveredAt:
      status === 'delivered' && head?.delivered_date ? new Date(head.delivered_date) : null,
    events,
  }
}

// ── cancel ──────────────────────────────────────────────────────────────────
export async function cancelShipment(
  ref: TrackingRef & { providerOrderId?: string | null },
): Promise<void> {
  if (ref.providerOrderId) {
    await call('/orders/cancel', { method: 'POST', body: { ids: [Number(ref.providerOrderId)] } }).catch(
      () => undefined,
    )
  }
  if (ref.awb) {
    await call('/courier/cancel', { method: 'POST', body: { awbs: [ref.awb] } }).catch(() => undefined)
  }
}

export const shiprocketProvider: ShippingProvider = {
  key: 'shiprocket',
  createShipment,
  getTracking,
  cancelShipment,
}
