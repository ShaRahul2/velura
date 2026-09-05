'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client'
import { actionNeedsConfirm, availableOrderActions, type OrderActionId } from '@/lib/orderActionPolicy'

export function OrderActions({
  orderId,
  status,
  paymentStatus,
  paymentMethod,
  razorpayPaymentId,
  total,
}: {
  orderId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  razorpayPaymentId: string | null
  total: number
}) {
  const router = useRouter()
  const [saving, setSaving] = useState<OrderActionId | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const actions = availableOrderActions({
    status,
    paymentStatus,
    paymentMethod,
    razorpayPaymentId,
    total,
  })

  async function run(action: OrderActionId, label: string, danger?: boolean) {
    if (actionNeedsConfirm(action)) {
      const ok = window.confirm(
        danger && (action === 'cancel' || action === 'return')
          ? `${label}. Continue?`
          : `${label}?`,
      )
      if (!ok) return
    }
    setError('')
    setSuccess('')
    setSaving(action)
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Could not update.')
        return
      }
      setSuccess('Order updated.')
      router.refresh()
    } catch {
      setError('Could not update.')
    } finally {
      setSaving(null)
    }
  }

  if (actions.length === 0) {
    return (
      <p className="font-sans text-[0.72rem] text-[rgba(237,233,228,0.4)]">
        This order is closed.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
        Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            title={action.hint}
            disabled={saving !== null}
            onClick={() => void run(action.id, action.label, action.danger)}
            className={
              action.danger
                ? 'h-10 rounded-[3px] border border-[rgba(196,160,144,0.45)] px-4 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#C4A090] disabled:opacity-40'
                : 'h-10 rounded-[3px] bg-[#EDE9E4] px-4 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#0F0D0B] disabled:opacity-40'
            }
          >
            {saving === action.id ? 'Working…' : action.label}
          </button>
        ))}
      </div>
      <p className="max-w-sm font-sans text-[0.68rem] leading-relaxed text-[rgba(237,233,228,0.4)]">
        {actions.map((action) => action.hint).join(' · ')}
      </p>
      {success && <p role="status" className="text-sm text-[#B8A898]">{success}</p>}
      {error && <p role="alert" className="font-sans text-[0.72rem] text-[#C4A090]">{error}</p>}
    </div>
  )
}
