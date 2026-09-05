import { redirect } from 'next/navigation'
import { auth as nextAuth } from '@/auth'
import { getOptionalProfile } from '@/lib/customerAuth'
import { isStaffRole, type ProfileRoleName, type RoleActor } from '@/lib/profileRole'

export type StaffActor = RoleActor & { email: string }

export async function getStaffActor(): Promise<StaffActor | null> {
  const session = await nextAuth()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  if (session?.user?.email && adminEmail && session.user.email.toLowerCase() === adminEmail) {
    return {
      id: 'env-admin',
      role: 'admin',
      source: 'env',
      email: session.user.email,
    }
  }
  const profile = await getOptionalProfile()
  if (profile && isStaffRole(profile.role)) {
    return {
      id: profile.id,
      role: profile.role as ProfileRoleName,
      source: 'clerk',
      email: profile.email,
    }
  }
  return null
}

export async function requireAdmin() {
  const actor = await getStaffActor()
  if (actor) return actor
  const profile = await getOptionalProfile()
  if (profile) redirect('/admin/forbidden')
  redirect('/admin/login')
}

export async function requireAdminApi(): Promise<StaffActor | null> {
  return getStaffActor()
}
