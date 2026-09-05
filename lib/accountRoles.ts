export const PROFILE_ROLES = ['customer', 'manager', 'admin'] as const
export type ProfileRole = (typeof PROFILE_ROLES)[number]

export function isProfileRole(value: unknown): value is ProfileRole {
  return typeof value === 'string' && (PROFILE_ROLES as readonly string[]).includes(value)
}

export function isStaffRole(role: unknown): role is 'manager' | 'admin' {
  return role === 'manager' || role === 'admin'
}

export function parseClerkRole(metadata: unknown): ProfileRole | null {
  if (!metadata || typeof metadata !== 'object') return null
  const role = (metadata as { role?: unknown }).role
  return isProfileRole(role) ? role : null
}

/** Admins may set manager ↔ customer. Admin grants stay on Clerk / SQL. */
export function canChangeRole(actor: ProfileRole, targetCurrent: ProfileRole, next: ProfileRole) {
  if (actor !== 'admin') return false
  if (targetCurrent === 'admin') return false
  return next === 'manager' || next === 'customer'
}
