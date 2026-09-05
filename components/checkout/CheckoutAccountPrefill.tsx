'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Address } from '@/types'

type AccountPayload = {
  email: string
  fullName: string | null
  phone: string | null
  addresses: Array<{
    firstName: string
    lastName: string
    phone: string | null
    line1: string
    city: string
    state: string
    postalCode: string
    isDefault: boolean
  }>
}

export function CheckoutAccountPrefill({
  address,
  onChange,
}: {
  address: Address
  onChange: (next: Address) => void
}) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return null
  return <PrefillInner address={address} onChange={onChange} />
}

function PrefillInner({
  address,
  onChange,
}: {
  address: Address
  onChange: (next: Address) => void
}) {
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    const empty = !address.email && !address.firstName && !address.addressLine
    if (!empty) return
    void fetch('/api/account')
      .then((res) => res.json())
      .then((json: { data?: AccountPayload }) => {
        const data = json.data
        if (!data) return
        const home = data.addresses.find((row) => row.isDefault) ?? data.addresses[0]
        const [first, ...rest] = (data.fullName ?? '').split(' ')
        onChange({
          firstName: home?.firstName || first || '',
          lastName: home?.lastName || rest.join(' '),
          email: data.email,
          phone: home?.phone || data.phone || '',
          addressLine: home?.line1 || '',
          city: home?.city || '',
          state: home?.state || '',
          pinCode: home?.postalCode || '',
        })
      })
      .catch(() => undefined)
  }, [isLoaded, isSignedIn, address.email, address.firstName, address.addressLine, onChange])

  return null
}
