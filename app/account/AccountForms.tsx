'use client'

import { useState } from 'react'
import { deleteAddressAction, saveAddressAction, setDefaultAddressAction, updateProfileAction } from './actions'

type AddressRow = {
  id: string
  label: string
  firstName: string
  lastName: string
  phone: string | null
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  isDefault: boolean
}

const fieldClass =
  'h-12 w-full rounded-input border border-lm bg-cream px-3 font-sans text-[0.88rem] text-deep focus:border-deep focus:outline-none'
const labelClass = 'mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve'

export function ProfileForm({ fullName, phone }: { fullName: string; phone: string }) {
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <form
      className="max-w-md space-y-4"
      action={async (formData) => {
        setError('')
        setSaved(false)
        const result = await updateProfileAction(formData)
        if ('error' in result && result.error) setError(result.error)
        else setSaved(true)
      }}
    >
      <div>
        <label htmlFor="fullName" className={labelClass}>Name</label>
        <input id="fullName" name="fullName" defaultValue={fullName} autoComplete="name" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input id="phone" name="phone" defaultValue={phone} inputMode="numeric" autoComplete="tel" className={fieldClass} />
      </div>
      {error && <p role="alert" className="font-sans text-[0.78rem] text-deep">{error}</p>}
      {saved && <p role="status" className="font-sans text-[0.78rem] text-mauve">Saved.</p>}
      <button type="submit" className="pressable pressable-track h-12 px-8 rounded-btn bg-deep font-sans text-[0.8rem] tracking-btn uppercase text-blush">
        Save profile
      </button>
    </form>
  )
}

export function AddressManager({ addresses }: { addresses: AddressRow[] }) {
  const [editing, setEditing] = useState<string | 'new' | null>(addresses.length === 0 ? 'new' : null)
  const current = editing && editing !== 'new' ? addresses.find((a) => a.id === editing) : null

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li key={address.id} className="border border-lm bg-cream p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose">
                  {address.label}
                  {address.isDefault ? ' · Default' : ''}
                </p>
                <p className="mt-2 font-serif text-[1.05rem] text-deep">
                  {address.firstName} {address.lastName}
                </p>
                <p className="mt-1 font-sans text-[0.82rem] font-light leading-relaxed text-mauve">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button type="button" onClick={() => setEditing(address.id)} className="font-sans text-[0.72rem] uppercase tracking-btn text-deep underline underline-offset-4">
                  Edit
                </button>
                {!address.isDefault && (
                  <form action={async (formData) => { await setDefaultAddressAction(formData) }}>
                    <input type="hidden" name="id" value={address.id} />
                    <button type="submit" className="font-sans text-[0.72rem] uppercase tracking-btn text-mauve hover:text-deep">
                      Make default
                    </button>
                  </form>
                )}
                <form action={async (formData) => { await deleteAddressAction(formData) }}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit" className="font-sans text-[0.72rem] uppercase tracking-btn text-mauve hover:text-deep">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing === null && (
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="pressable pressable-track h-12 px-8 rounded-btn border border-deep font-sans text-[0.8rem] tracking-btn uppercase text-deep"
        >
          Add address
        </button>
      )}

      {editing !== null && (
        <AddressForm
          key={editing}
          address={current ?? undefined}
          onCancel={() => setEditing(addresses.length ? null : 'new')}
        />
      )}
    </div>
  )
}

function AddressForm({ address, onCancel }: { address?: AddressRow; onCancel: () => void }) {
  const [error, setError] = useState('')

  return (
    <form
      className="max-w-lg space-y-4 border border-lm p-5"
      action={async (formData) => {
        setError('')
        const result = await saveAddressAction(formData)
        if ('error' in result && result.error) setError(result.error)
        else onCancel()
      }}
    >
      {address?.id && <input type="hidden" name="id" value={address.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="label" label="Label" defaultValue={address?.label ?? 'Home'} />
        <label className="flex items-end gap-2 pb-3 font-sans text-[0.78rem] text-mauve">
          <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault ?? true} className="accent-deep" />
          Default
        </label>
        <Field name="firstName" label="First name" defaultValue={address?.firstName} autoComplete="given-name" />
        <Field name="lastName" label="Last name" defaultValue={address?.lastName} autoComplete="family-name" />
      </div>
      <Field name="phone" label="Phone" defaultValue={address?.phone ?? ''} autoComplete="tel" />
      <Field name="line1" label="Address" defaultValue={address?.line1} autoComplete="address-line1" />
      <Field name="line2" label="Line 2" defaultValue={address?.line2 ?? ''} autoComplete="address-line2" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="city" label="City" defaultValue={address?.city} autoComplete="address-level2" />
        <Field name="state" label="State" defaultValue={address?.state} autoComplete="address-level1" />
        <Field name="postalCode" label="PIN" defaultValue={address?.postalCode} autoComplete="postal-code" />
      </div>
      {error && <p role="alert" className="font-sans text-[0.78rem] text-deep">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" className="pressable pressable-track h-12 px-8 rounded-btn bg-deep font-sans text-[0.8rem] tracking-btn uppercase text-blush">
          Save address
        </button>
        <button type="button" onClick={onCancel} className="h-12 px-4 font-sans text-[0.78rem] uppercase tracking-btn text-mauve">
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  defaultValue = '',
  autoComplete,
}: {
  name: string
  label: string
  defaultValue?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} autoComplete={autoComplete} className={fieldClass} />
    </div>
  )
}
