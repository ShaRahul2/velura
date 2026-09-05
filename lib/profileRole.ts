export const PROFILE_ROLES = ['customer', 'manager', 'admin'] as const
export type ProfileRoleName = (typeof PROFILE_ROLES)[number]

export function parseProfileRole(value: unknown): ProfileRoleName | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return PROFILE_ROLES.includes(normalized as ProfileRoleName)
    ? (normalized as ProfileRoleName)
    : null
}

export function isStaffRole(role: ProfileRoleName | null | undefined): boolean {
  return role === 'admin' || role === 'manager'
}

export type RoleActor = {
  id: string
  role: ProfileRoleName
  source: 'clerk' | 'env'
}

export type RoleChangeResult =
  | { ok: true }
  | { ok: false; error: string }

export function canChangeRole(params: {
  actor: RoleActor
  targetId: string
  targetRole: ProfileRoleName
  nextRole: ProfileRoleName
  otherAdminCount: number
}): RoleChangeResult {
  if (params.actor.role !== 'admin' && params.actor.source !== 'env') {
    return { ok: false, error: 'Only admins can change roles.' }
  }
  if (params.nextRole === 'admin' && params.actor.role !== 'admin' && params.actor.source !== 'env') {
    return { ok: false, error: 'Only admins can grant admin.' }
  }
  const demotingSelfOffAdmin =
    params.actor.id === params.targetId &&
    params.targetRole === 'admin' &&
    params.nextRole !== 'admin'
  if (demotingSelfOffAdmin && params.otherAdminCount < 1) {
    return { ok: false, error: 'Another admin must exist before you leave admin.' }
  }
  return { ok: true }
}
