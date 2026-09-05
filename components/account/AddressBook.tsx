'use client'

import { useState } from 'react'
import type { Address } from '@prisma/client'
import { Button } from '@/components/ui/Button'

const empty = {
  label: 'Home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  isDefault: false,
}

export function AddressBook({ initial }: { initial: Address[] }) {
  const [addresses, setAddresses] = useState(initial)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function refresh() {
    const res = await fetch('/api/account/addresses')
    const json = (await res.json()) as { data?: Address[] }
    if (Array.isArray(json.data)) setAddresses(json.data)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(editingId ? { id: editingId } : {}),
        ...form,
        line2: form.line2 || null,
      }),
    })
    const json = (await res.json()) as { error?: string }
    if (!res.ok) {
      setError(json.error ?? 'Could not save address.')
      return
    }
    setForm(empty)
    setEditingId(null)
    await refresh()
  }

  async function onDelete(id: string) {
    await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    await refresh()
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ul className="space-y-4">
        {addresses.length === 0 ? (
          <li className="font-sans text-[0.9rem] font-light text-mauve">No addresses yet.</li>
        ) : (
          addresses.map((address) => (
            <li key={address.id} className="border border-lm bg-cream p-5">
              <p className="mb-1 font-sans text-[0.68rem] tracking-label uppercase text-rose">
                {address.label}
                {address.isDefault ? ' · Default' : ''}
              </p>
              <p className="font-sans text-[0.88rem] text-deep">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
              </p>
              <p className="font-sans text-[0.82rem] text-mauve">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  className="font-sans text-[0.72rem] tracking-btn uppercase text-deep underline underline-offset-4"
                  onClick={() => {
                    setEditingId(address.id)
                    setForm({
                      label: address.label,
                      line1: address.line1,
                      line2: address.line2 ?? '',
                      city: address.city,
                      state: address.state,
                      postalCode: address.postalCode,
                      isDefault: address.isDefault,
                    })
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="font-sans text-[0.72rem] tracking-btn uppercase text-mauve underline underline-offset-4"
                  onClick={() => void onDelete(address.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={onSubmit} className="space-y-3">
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-mauve">
          {editingId ? 'Edit address' : 'Add address'}
        </p>
        {(['label', 'line1', 'line2', 'city', 'state', 'postalCode'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`addr-${field}`} className="mb-1 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
              {field === 'postalCode' ? 'PIN' : field === 'line1' ? 'Line 1' : field === 'line2' ? 'Line 2' : field}
            </label>
            <input
              id={`addr-${field}`}
              value={form[field]}
              onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))}
              required={field !== 'line2'}
              className="h-11 w-full rounded-input border border-lm bg-cream px-3 font-sans text-[0.88rem] text-deep outline-none focus:border-deep"
            />
          </div>
        ))}
        <label className="flex items-center gap-2 font-sans text-[0.8rem] text-mauve">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((current) => ({ ...current, isDefault: e.target.checked }))}
          />
          Default address
        </label>
        {error ? (
          <p role="alert" className="font-sans text-[0.78rem] text-mauve">
            {error}
          </p>
        ) : null}
        <Button type="submit">{editingId ? 'Update address' : 'Save address'}</Button>
      </form>
    </div>
  )
}
