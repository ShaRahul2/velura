'use client'

import { useState } from 'react'
import type { Profile } from '@prisma/client'
import { Button } from '@/components/ui/Button'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.fullName ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim() ? phone.trim() : null,
        }),
      })
      const json = (await res.json()) as { error?: string }
      setStatus(res.ok ? 'Saved.' : (json.error ?? 'Could not save.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="profile-email" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
          Email
        </label>
        <input
          id="profile-email"
          value={profile.email}
          readOnly
          className="h-12 w-full rounded-input border border-lm bg-blush/50 px-4 font-sans text-[0.9rem] text-mauve"
        />
      </div>
      <div>
        <label htmlFor="profile-name" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
          Name
        </label>
        <input
          id="profile-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="h-12 w-full rounded-input border border-lm bg-cream px-4 font-sans text-[0.9rem] text-deep outline-none focus:border-deep"
        />
      </div>
      <div>
        <label htmlFor="profile-phone" className="mb-1.5 block font-sans text-[0.68rem] tracking-label uppercase text-mauve">
          Phone
        </label>
        <input
          id="profile-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          inputMode="numeric"
          autoComplete="tel"
          className="h-12 w-full rounded-input border border-lm bg-cream px-4 font-sans text-[0.9rem] text-deep outline-none focus:border-deep"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save profile'}
      </Button>
      {status ? (
        <p role="status" className="font-sans text-[0.78rem] text-mauve">
          {status}
        </p>
      ) : null}
    </form>
  )
}
