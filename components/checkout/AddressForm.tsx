'use client'

import { useState } from 'react'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'

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
  const show = touched || Boolean(submitted)
  const emptyError = required && show && !value.trim() ? `Enter ${label.toLowerCase()}` : null
  const formatError = show && value ? (validate?.(value) ?? null) : null
  const error = emptyError ?? formatError
  const fieldId = `checkout-${name}`
  const errorId = `${fieldId}-error`

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
        {label}{required && <span className="ml-0.5 text-rose">*</span>}
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
        placeholder={error ? undefined : placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-12 w-full scroll-mt-24 rounded-input border bg-cream px-3 font-sans text-[0.88rem] text-deep placeholder:text-mauve/35 transition-colors focus:border-deep focus:outline-none focus-visible:outline-none',
          error ? 'border-deep' : 'border-lm'
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 font-sans text-[0.68rem] text-deep">
          {error}
        </p>
      )}
      {!error && hint && !touched && (
        <p className="mt-1 font-sans text-[0.62rem] text-mauve/70">{hint}</p>
      )}
    </div>
  )
}

export function AddressForm({ value, onChange, submitted }: AddressFormProps) {
  function set(field: keyof Address) {
    return (v: string) => onChange({ ...value, [field]: v })
  }

  const stateError = Boolean(submitted) && !value.state
  const stateErrorId = 'checkout-state-error'

  return (
    <div>
      <p className="mb-5 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Delivery
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" value={value.firstName} onChange={set('firstName')} submitted={submitted} />
          <Field label="Last name"  name="lastName"  value={value.lastName}  onChange={set('lastName')}  submitted={submitted} />
        </div>
        <Field
          label="Email" name="email" value={value.email} onChange={set('email')}
          type="email" submitted={submitted}
          validate={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address'}
        />
        <Field
          label="Phone" name="phone" value={value.phone} onChange={set('phone')}
          type="tel" submitted={submitted} inputMode="numeric"
          validate={(v) => /^\d{10}$/.test(v.replace(/\s/g, '')) ? null : 'Enter a 10-digit mobile number'}
          hint="10-digit mobile number"
        />
        <Field
          label="Address"
          name="addressLine"
          value={value.addressLine}
          onChange={set('addressLine')}
          placeholder="Building, street, area"
          submitted={submitted}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="City" name="city" value={value.city} onChange={set('city')} submitted={submitted} />
          <div>
            <label htmlFor="checkout-state" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
              State <span className="text-rose">*</span>
            </label>
            <select
              id="checkout-state"
              name="state"
              value={value.state}
              onChange={(e) => set('state')(e.target.value)}
              required
              autoComplete="address-level1"
              aria-invalid={stateError}
              aria-describedby={stateError ? stateErrorId : undefined}
              className={cn(
                'h-12 w-full scroll-mt-24 appearance-none rounded-input border bg-cream px-3 font-sans text-[0.88rem] transition-colors focus:border-deep focus:outline-none',
                stateError ? 'border-deep' : 'border-lm',
                value.state ? 'text-deep' : 'text-mauve/40'
              )}
            >
              <option value="" disabled>
                Select
              </option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s} className="text-deep">
                  {s}
                </option>
              ))}
            </select>
            {stateError && (
              <p id={stateErrorId} role="alert" className="mt-1 font-sans text-[0.68rem] text-deep">
                Enter state
              </p>
            )}
          </div>
          <Field
            label="PIN code" name="pinCode" value={value.pinCode} onChange={set('pinCode')}
            submitted={submitted} inputMode="numeric"
            validate={(v) => /^\d{6}$/.test(v) ? null : 'Enter a 6-digit PIN code'}
            hint="6-digit postal code"
          />
        </div>
      </div>
    </div>
  )
}
