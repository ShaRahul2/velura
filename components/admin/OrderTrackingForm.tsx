'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CARRIERS = ['Delhivery', 'Blue Dart', 'DTDC', 'India Post', 'Shadowfax', 'Other']

export function OrderTrackingForm({
  orderId,
  carrier,
  trackingNumber,
}: {
  orderId: string
  carrier: string | null
  trackingNumber: string | null
}) {
  const router = useRouter()
  const [value, setValue] = useState({
    carrier: carrier ?? '',
    trackingNumber: trackingNumber ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        setError(json.error ?? 'Could not save tracking.')
        return
      }
      router.refresh()
    } catch {
      setError('Could not save tracking.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
        Tracking
      </h2>
      <label className="block">
        <span className="mb-1.5 block font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(237,233,228,0.4)]">
          Carrier
        </span>
        <select
          value={value.carrier}
          onChange={(e) => setValue((v) => ({ ...v, carrier: e.target.value }))}
          className="h-10 w-full appearance-none rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
        >
          <option value="" className="bg-[#141210]">Select</option>
          {CARRIERS.map((name) => (
            <option key={name} value={name} className="bg-[#141210]">
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(237,233,228,0.4)]">
          AWB / tracking
        </span>
        <input
          value={value.trackingNumber}
          onChange={(e) => setValue((v) => ({ ...v, trackingNumber: e.target.value }))}
          className="h-10 w-full rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
        />
      </label>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="h-10 rounded-[3px] border border-[rgba(184,168,152,0.25)] px-4 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#EDE9E4] disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Save tracking'}
      </button>
      {error && <p className="font-sans text-[0.72rem] text-[#C4A090]">{error}</p>}
    </div>
  )
}
