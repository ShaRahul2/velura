'use client'

import { useState } from 'react'
import type { Address } from '@/types'

interface AddressFormProps {
  value: Address
  onChange: (address: Address) => void
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
]

function Field({
  label, name, value, onChange, type = 'text', placeholder, required = true,
  validate, hint,
}: {
  label: string; name: keyof Address; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
  validate?: (v: string) => string | null
  hint?: string
}) {
  const [touched, setTouched] = useState(false)
  const error = touched && value ? (validate?.(value) ?? null) : null

  return (
    <div>
      <label className="font-sans text-[0.65rem] tracking-label uppercase text-mauve block mb-1.5">
        {label}{required && <span className="text-rose ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        autoComplete={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        required={required}
        className="w-full h-11 px-3 font-sans text-[0.85rem] text-deep bg-cream border focus:outline-none transition-colors"
        style={{ borderRadius: 3, borderColor: error ? 'var(--rose)' : touched && value ? 'var(--deep)' : 'var(--lm)' }}
      />
      {error && (
        <p className="font-sans text-[0.62rem] text-rose mt-1">{error}</p>
      )}
      {!error && hint && !touched && (
        <p className="font-sans text-[0.62rem] text-mauve opacity-60 mt-1">{hint}</p>
      )}
    </div>
  )
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  function set(field: keyof Address) {
    return (v: string) => onChange({ ...value, [field]: v })
  }

  return (
    <div>
      <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
        Delivery Details
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" value={value.firstName} onChange={set('firstName')} placeholder="Priya" />
          <Field label="Last name"  name="lastName"  value={value.lastName}  onChange={set('lastName')}  placeholder="Sharma" />
        </div>
        <Field
          label="Email" name="email" value={value.email} onChange={set('email')}
          type="email" placeholder="priya@email.com"
          validate={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address'}
        />
        <Field
          label="Phone" name="phone" value={value.phone} onChange={set('phone')}
          type="tel" placeholder="9876543210"
          validate={(v) => /^\d{10}$/.test(v.replace(/\s/g, '')) ? null : 'Enter a 10-digit mobile number'}
          hint="10-digit mobile number, no spaces"
        />
        <Field label="Address" name="addressLine" value={value.addressLine} onChange={set('addressLine')} placeholder="House/Flat no., Street, Area" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" value={value.city} onChange={set('city')} placeholder="Mumbai" />
          <div>
            <label className="font-sans text-[0.65rem] tracking-label uppercase text-mauve block mb-1.5">
              State <span className="text-rose">*</span>
            </label>
            <select
              value={value.state}
              onChange={(e) => set('state')(e.target.value)}
              required
              className="w-full h-11 px-3 font-sans text-[0.85rem] text-deep bg-cream border border-lm focus:border-deep focus:outline-none transition-colors appearance-none"
              style={{ borderRadius: 3 }}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-1/2">
          <Field
            label="PIN code" name="pinCode" value={value.pinCode} onChange={set('pinCode')}
            placeholder="400001"
            validate={(v) => /^\d{6}$/.test(v) ? null : 'Enter a 6-digit PIN code'}
            hint="6-digit postal code"
          />
        </div>
      </div>
    </div>
  )
}
