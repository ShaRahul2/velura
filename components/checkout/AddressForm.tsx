'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Address } from '@/types'
import { cn } from '@/lib/utils'
import { INDIAN_STATES, googlePlacesAvailable } from '@/lib/indianAddress'
import {
  fetchPlaceSuggestions,
  newPlacesSession,
  placeFromPrediction,
  placeToAddress,
  waitForGoogleMaps,
  type PlaceSuggestion,
} from '@/lib/googlePlaces'

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
  placeId: 'off',
  lat: 'off',
  lng: 'off',
}

function Field({
  label, name, value, onChange, type = 'text', placeholder, required = true,
  validate, hint, submitted, inputMode, inputRef, autoComplete,
  onKeyDown, expanded, controls,
}: {
  label: string; name: keyof Address; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean
  validate?: (v: string) => string | null
  hint?: string
  submitted?: boolean
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'search'
  inputRef?: React.RefObject<HTMLInputElement | null>
  autoComplete?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  expanded?: boolean
  controls?: string
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
        ref={inputRef}
        id={fieldId}
        type={type}
        name={name}
        autoComplete={autoComplete ?? AUTOCOMPLETE[name]}
        inputMode={inputMode}
        role={controls ? 'combobox' : undefined}
        aria-autocomplete={controls ? 'list' : undefined}
        aria-expanded={controls ? expanded : undefined}
        aria-controls={controls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setTouched(true)}
        placeholder={error ? undefined : placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? `${fieldId}-hint` : undefined}
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
      {!error && hint && (
        <p id={`${fieldId}-hint`} className="mt-1 font-sans text-[0.62rem] text-mauve/70">{hint}</p>
      )}
    </div>
  )
}

export function AddressForm({ value, onChange, submitted }: AddressFormProps) {
  const addressRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const valueRef = useRef(value)
  valueRef.current = value
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const placesOn = googlePlacesAvailable()
  const [pinHint, setPinHint] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [listOpen, setListOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const requestIdRef = useRef(0)
  const pickingRef = useRef(false)
  const listboxId = useId()

  function set(field: keyof Address) {
    return (v: string) => onChange({ ...value, [field]: v })
  }

  useEffect(() => {
    if (!placesOn) return
    let cancelled = false
    void waitForGoogleMaps().then((ready) => {
      if (!cancelled && ready) {
        void newPlacesSession().then((token) => {
          if (!cancelled) sessionRef.current = token
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [placesOn])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as Node
      if (addressRef.current?.contains(target) || listRef.current?.contains(target)) return
      setListOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!placesOn) return
    const query = value.addressLine.trim()
    if (pickingRef.current) {
      pickingRef.current = false
      setSuggestions([])
      setListOpen(false)
      return
    }
    if (query.length < 3) {
      setSuggestions([])
      setListOpen(false)
      return
    }

    const requestId = ++requestIdRef.current
    const t = window.setTimeout(() => {
      void (async () => {
        const ready = await waitForGoogleMaps()
        if (!ready) return
        if (!sessionRef.current) sessionRef.current = await newPlacesSession()
        try {
          const next = await fetchPlaceSuggestions(query, sessionRef.current)
          if (requestId !== requestIdRef.current) return
          setSuggestions(next)
          setActiveIndex(0)
          setListOpen(next.length > 0)
        } catch {
          if (requestId !== requestIdRef.current) return
          setSuggestions([])
          setListOpen(false)
        }
      })()
    }, 220)

    return () => window.clearTimeout(t)
  }, [placesOn, value.addressLine])

  async function applySuggestion(suggestion: PlaceSuggestion) {
    pickingRef.current = true
    try {
      const place = await placeFromPrediction(suggestion.prediction)
      onChangeRef.current(placeToAddress(place, valueRef.current))
    } catch {
      onChangeRef.current({ ...valueRef.current, addressLine: suggestion.text })
    }
    sessionRef.current = await newPlacesSession().catch(() => null)
    setSuggestions([])
    setListOpen(false)
  }

  useEffect(() => {
    const pin = value.pinCode.trim()
    if (!/^\d{6}$/.test(pin)) {
      setPinHint('')
      return
    }
    if (valueRef.current.city && valueRef.current.state) return

    const ctrl = new AbortController()
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/address/pincode?pin=${pin}`, { signal: ctrl.signal })
        const json = (await res.json()) as { data?: { city: string; state: string }; error?: string }
        if (!res.ok || !json.data) {
          setPinHint(json.error ?? '')
          return
        }
        setPinHint('')
        const current = valueRef.current
        onChangeRef.current({
          ...current,
          city: current.city || json.data.city,
          state: current.state || json.data.state,
        })
      } catch {
        /* ignore abort */
      }
    }, 350)

    return () => {
      ctrl.abort()
      window.clearTimeout(t)
    }
  }, [value.pinCode])

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
        <div className="relative">
          <Field
            label="Address"
            name="addressLine"
            value={value.addressLine}
            onChange={set('addressLine')}
            placeholder={placesOn ? 'Start typing a building or street' : 'Building, street, area'}
            hint={placesOn ? 'Pick a Google suggestion for a precise pin.' : 'Enter the street, then PIN to fill city and state.'}
            submitted={submitted}
            inputRef={addressRef}
            autoComplete={placesOn ? 'off' : 'street-address'}
            expanded={listOpen}
            controls={placesOn ? listboxId : undefined}
            onKeyDown={(e) => {
              if (!placesOn || !listOpen || suggestions.length === 0) return
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActiveIndex((i) => (i + 1) % suggestions.length)
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
              } else if (e.key === 'Enter') {
                e.preventDefault()
                const next = suggestions[activeIndex]
                if (next) void applySuggestion(next)
              } else if (e.key === 'Escape') {
                setListOpen(false)
              }
            }}
          />
          {placesOn && listOpen && suggestions.length > 0 && (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label="Address suggestions"
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-lm bg-cream shadow-card"
            >
              {suggestions.map((suggestion, i) => (
                <li key={suggestion.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    className={cn(
                      'w-full px-3 py-2.5 text-left font-sans text-[0.82rem] leading-snug text-deep',
                      i === activeIndex ? 'bg-blush/70' : 'bg-transparent hover:bg-blush/50',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => void applySuggestion(suggestion)}
                  >
                    {suggestion.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
            hint={pinHint || '6-digit postal code — fills city and state'}
          />
        </div>
      </div>
    </div>
  )
}
