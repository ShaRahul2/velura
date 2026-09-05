'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CustomerRoleForm({
  profileId,
  role,
  canEdit,
}: {
  profileId: string
  role: string
  canEdit: boolean
}) {
  const router = useRouter()
  const [value, setValue] = useState(role)
  const [error, setError] = useState('')

  if (!canEdit || role === 'admin') {
    return <span className="uppercase tracking-[0.08em]">{role}</span>
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        setError('')
        void (async () => {
          const res = await fetch(`/api/admin/customers/${profileId}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: value }),
          })
          const json = (await res.json()) as { error?: string }
          if (!res.ok) {
            setError(json.error ?? 'Could not update role')
            return
          }
          router.refresh()
        })()
      }}
    >
      <label className="sr-only" htmlFor={`role-${profileId}`}>Role</label>
      <select
        id={`role-${profileId}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 rounded-[3px] border border-[#413830] bg-[#141210] px-2 text-sm text-[#EDE9E4]"
      >
        <option value="customer">customer</option>
        <option value="manager">manager</option>
      </select>
      <button type="submit" className="h-9 px-3 text-[0.7rem] uppercase tracking-[0.1em] text-[#B8A898]">
        Save
      </button>
      {error && <span role="alert" className="text-[0.7rem] text-[#C4A090]">{error}</span>}
    </form>
  )
}
