'use client'

import { useState } from 'react'
import type { Profile, ProfileRole } from '@prisma/client'

export function RoleSelect({
  profile,
  canEdit,
}: {
  profile: Pick<Profile, 'id' | 'role'>
  canEdit: boolean
}) {
  const [role, setRole] = useState<ProfileRole>(profile.role)
  const [status, setStatus] = useState('')

  if (!canEdit) {
    return <span className="capitalize">{profile.role}</span>
  }

  async function onChange(next: ProfileRole) {
    setRole(next)
    setStatus('')
    const res = await fetch(`/api/admin/customers/${profile.id}/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: next }),
    })
    const json = (await res.json()) as { error?: string }
    setStatus(res.ok ? 'Updated' : (json.error ?? 'Failed'))
    if (!res.ok) setRole(profile.role)
  }

  return (
    <div>
      <select
        aria-label="Customer role"
        className="admin-select"
        value={role}
        onChange={(e) => void onChange(e.target.value as ProfileRole)}
      >
        <option value="customer">customer</option>
        <option value="manager">manager</option>
        <option value="admin">admin</option>
      </select>
      {status ? <p className="admin-muted">{status}</p> : null}
    </div>
  )
}
