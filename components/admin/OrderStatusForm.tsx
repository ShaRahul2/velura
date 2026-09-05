'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { OrderStatus } from '@prisma/client'
import { ORDER_LABEL, ORDER_STATUSES } from '@/lib/adminOrders'

export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter()
  const [value, setValue] = useState(status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        setError(json.error ?? 'Could not update.')
        return
      }
      router.refresh()
    } catch {
      setError('Could not update.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1.5 block font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
          Fulfilment
        </span>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value as OrderStatus)}
          className="h-10 min-w-[10rem] appearance-none rounded-[3px] border border-[rgba(184,168,152,0.2)] bg-[rgba(237,233,228,0.06)] px-3 font-sans text-[0.82rem] text-[#EDE9E4] outline-none"
        >
          {ORDER_STATUSES.map((key) => (
            <option key={key} value={key} className="bg-[#141210] text-[#EDE9E4]">
              {ORDER_LABEL[key]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving || value === status}
        className="h-10 rounded-[3px] bg-[#EDE9E4] px-4 font-sans text-[0.72rem] tracking-[0.1em] uppercase text-[#0F0D0B] disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Update'}
      </button>
      {error && <p className="font-sans text-[0.72rem] text-[#C4A090]">{error}</p>}
    </div>
  )
}
