'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ShipmentStatus } from '@prisma/client'
import { SHIPMENT_STATUS_LABEL } from '@/lib/shipping/status'

export interface ShipmentPanelData {
  id: string
  provider: 'shiprocket' | 'manual'
  status: ShipmentStatus
  awb: string | null
  courier: string | null
  labelUrl: string | null
  trackingUrl: string | null
  estimatedDelivery: string | null
  pickupScheduledAt: string | null
  lastSyncedAt: string | null
  events: {
    id: string
    status: ShipmentStatus
    description: string
    location: string | null
    occurredAt: string
  }[]
}

const OPEN_STATUSES: ShipmentStatus[] = [
  'pending',
  'awb_assigned',
  'pickup_scheduled',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'undelivered',
  'rto_in_transit',
]

export function ShipmentPanel({
  orderId,
  providerKey,
  shipment,
}: {
  orderId: string
  providerKey: 'shiprocket' | 'manual'
  shipment: ShipmentPanelData | null
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [weight, setWeight] = useState('')
  const [manualAwb, setManualAwb] = useState('')
  const [manualCourier, setManualCourier] = useState('')

  async function post(payload: Record<string, unknown>, tag: string) {
    setError('')
    setBusy(tag)
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Could not update shipment.')
        return
      }
      router.refresh()
    } catch {
      setError('Could not update shipment.')
    } finally {
      setBusy(null)
    }
  }

  const heading = (
    <h2 className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">Shipment</h2>
  )

  if (!shipment) {
    return (
      <section className="space-y-3">
        {heading}
        <p className="font-sans text-[0.72rem] leading-relaxed text-[rgba(237,233,228,0.45)]">
          {providerKey === 'shiprocket'
            ? 'Books the parcel on Shiprocket — assigns an AWB, schedules pickup, generates the label, and emails the customer.'
            : 'Shiprocket is not configured. Enter the AWB and courier you booked manually.'}
        </p>

        {providerKey === 'manual' && (
          <div className="grid grid-cols-2 gap-2">
            <input
              value={manualCourier}
              onChange={(e) => setManualCourier(e.target.value)}
              placeholder="Courier (Delhivery…)"
              className="h-10 rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
            />
            <input
              value={manualAwb}
              onChange={(e) => setManualAwb(e.target.value)}
              placeholder="AWB / tracking no."
              className="h-10 rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputMode="decimal"
            placeholder="Weight kg (opt.)"
            className="h-10 w-32 rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
          />
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              post(
                {
                  action: 'create',
                  ...(weight.trim() ? { weightKg: Number(weight) } : {}),
                  ...(manualAwb.trim() ? { manualAwb: manualAwb.trim() } : {}),
                  ...(manualCourier.trim() ? { manualCourier: manualCourier.trim() } : {}),
                },
                'create',
              )
            }
            className="h-10 rounded-[3px] bg-[#EDE9E4] px-4 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#0F0D0B] disabled:opacity-40"
          >
            {busy === 'create' ? 'Booking…' : 'Create shipment'}
          </button>
        </div>
        {error && <p className="font-sans text-[0.72rem] text-[#C4A090]">{error}</p>}
      </section>
    )
  }

  const isOpen = OPEN_STATUSES.includes(shipment.status)

  return (
    <section className="space-y-4">
      {heading}

      <div className="rounded-[4px] border border-[rgba(184,168,152,0.15)] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-[0.82rem] text-[#EDE9E4]">
            {SHIPMENT_STATUS_LABEL[shipment.status]}
          </span>
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.12em] text-[rgba(237,233,228,0.35)]">
            {shipment.provider}
          </span>
        </div>
        <dl className="mt-3 space-y-1.5">
          {shipment.courier && <Row label="Courier" value={shipment.courier} />}
          {shipment.awb && <Row label="AWB" value={shipment.awb} />}
          {shipment.estimatedDelivery && (
            <Row label="ETA" value={new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN')} />
          )}
          {shipment.lastSyncedAt && (
            <Row
              label="Synced"
              value={new Date(shipment.lastSyncedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            />
          )}
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          {shipment.labelUrl && (
            <a
              href={shipment.labelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.66rem] tracking-[0.1em] uppercase text-[#EDE9E4]"
            >
              Label
            </a>
          )}
          {shipment.trackingUrl && (
            <a
              href={shipment.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.66rem] tracking-[0.1em] uppercase text-[#EDE9E4]"
            >
              Track
            </a>
          )}
          {shipment.provider === 'shiprocket' && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => post({ action: 'sync' }, 'sync')}
              className="h-9 rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.66rem] tracking-[0.1em] uppercase text-[#EDE9E4] disabled:opacity-40"
            >
              {busy === 'sync' ? 'Refreshing…' : 'Refresh tracking'}
            </button>
          )}
          {isOpen && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => {
                if (window.confirm('Cancel this shipment with the courier?')) post({ action: 'cancel' }, 'cancel')
              }}
              className="h-9 rounded-[3px] border border-[rgba(196,160,144,0.45)] px-3 font-sans text-[0.66rem] tracking-[0.1em] uppercase text-[#C4A090] disabled:opacity-40"
            >
              {busy === 'cancel' ? 'Cancelling…' : 'Cancel shipment'}
            </button>
          )}
        </div>
      </div>

      {shipment.events.length > 0 && (
        <ol className="space-y-3 border-l border-[rgba(184,168,152,0.2)] pl-4">
          {shipment.events.map((ev) => (
            <li key={ev.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#B8A898]" />
              <p className="font-sans text-[0.78rem] text-[#EDE9E4]">{ev.description}</p>
              <p className="mt-0.5 font-sans text-[0.64rem] text-[rgba(237,233,228,0.4)]">
                {SHIPMENT_STATUS_LABEL[ev.status]}
                {ev.location ? ` · ${ev.location}` : ''} ·{' '}
                {new Date(ev.occurredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </li>
          ))}
        </ol>
      )}

      {error && <p className="font-sans text-[0.72rem] text-[#C4A090]">{error}</p>}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-sans text-[0.64rem] text-[rgba(237,233,228,0.4)]">{label}</dt>
      <dd className="break-all text-right font-sans text-[0.72rem] text-[#EDE9E4]">{value}</dd>
    </div>
  )
}
