'use client'

import { useState } from 'react'
import type { Address } from '@/types'

interface AddressFormProps {
  value: Address
  onChange: (address: Address) => void
  submitted?: boolean
}

const AUTOCOMPLETE: Record<keyof Address, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phone: 'tel',
  addressLine: 'street-address',
  city: 'address-level2',
  state: 'address-level1',
  pinCode: 'postal-code',
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
  validate, hint, submitted, inputMode,
}: {
  label: string; name: keyof Address; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
  validate?: (v: string) => string | null
  hint?: string
  submitted?: boolean
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'search'
}) {
  const [touched, setTouched] = useState(false)
  const show = touched || submitted
  const emptyError = required && show && !value.trim() ? `Enter ${label.toLowerCase()}` : null
  const formatError = show && value ? (validate?.(value) ?? null) : null
  const error = emptyError ?? formatError
  const fieldId = `checkout-${name}`
  const errorId = `${fieldId}-error`

  return (
    <div>
      <label htmlFor={fieldId} className="font-sans text-[0.65rem] lg:text-[0.7rem] tracking-label uppercase text-mauve block mb-1.5">
        {label}{required && <span className="text-rose ml-0.5">*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        autoComplete={AUTOCOMPLETE[name]}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full h-11 lg:h-12 px-3 font-sans text-[0.85rem] lg:text-[0.92rem] text-deep bg-cream border focus:outline-none focus-visible:outline-none focus:border-deep transition-colors"
        style={{ borderRadius: 3, borderColor: error ? 'var(--deep)' : 'var(--lm)' }}
      />
      {error && (
        <p id={errorId} role="alert" className="font-sans text-[0.62rem] lg:text-[0.68rem] text-mauve mt-1">{error}</p>
      )}
      {!error && hint && !touched && (
        <p className="font-sans text-[0.62rem] text-mauve opacity-60 mt-1">{hint}</p>
      )}
    </div>
  )
}

export function AddressForm({ value, onChange, submitted }: AddressFormProps) {
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
          <Field label="First name" name="firstName" value={value.firstName} onChange={set('firstName')} placeholder="Priya" submitted={submitted} />
          <Field label="Last name"  name="lastName"  value={value.lastName}  onChange={set('lastName')}  placeholder="Sharma" submitted={submitted} />
        </div>
        <Field
          label="Email" name="email" value={value.email} onChange={set('email')}
          type="email" placeholder="priya@email.com" submitted={submitted}
          validate={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address'}
        />
        <Field
          label="Phone" name="phone" value={value.phone} onChange={set('phone')}
          type="tel" placeholder="9876543210" submitted={submitted} inputMode="numeric"
          validate={(v) => /^\d{10}$/.test(v.replace(/\s/g, '')) ? null : 'Enter a 10-digit mobile number'}
          hint="10-digit mobile number, no spaces"
        />
        <Field label="Address" name="addressLine" value={value.addressLine} onChange={set('addressLine')} placeholder="House/Flat no., Street, Area" submitted={submitted} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" value={value.city} onChange={set('city')} placeholder="Mumbai" submitted={submitted} />
          <div>
            <label htmlFor="checkout-state" className="font-sans text-[0.65rem] lg:text-[0.7rem] tracking-label uppercase text-mauve block mb-1.5">
              State <span className="text-rose">*</span>
            </label>
            <select
              id="checkout-state"
              value={value.state}
              onChange={(e) => set('state')(e.target.value)}
              required
              autoComplete="address-level1"
              aria-invalid={submitted && !value.state}
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
            placeholder="400001" submitted={submitted} inputMode="numeric"
            validate={(v) => /^\d{6}$/.test(v) ? null : 'Enter a 6-digit PIN code'}
            hint="6-digit postal code"
          />
        </div>
      </div>
    </div>
  )
}
