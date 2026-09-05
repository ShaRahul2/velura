import { auth as clerkAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { auth as nextAuth } from '@/auth'
import { clerkConfigured } from '@/lib/clerkEnv'
import { ensureProfileForUserId } from '@/lib/profiles'
import { isStaffRole, type ProfileRole } from '@/lib/accountRoles'

export type StaffActor = {
  role: 'manager' | 'admin'
  source: 'credentials' | 'clerk'
  userId: string
  email: string
}

function credentialsEmail() {
  return process.env.ADMIN_EMAIL?.toLowerCase().trim() ?? ''
}

export async function getStaff(): Promise<StaffActor | null> {
  const session = await nextAuth()
  const credEmail = credentialsEmail()
  if (session?.user?.email && credEmail && session.user.email.toLowerCase().trim() === credEmail) {
    return {
      role: 'admin',
      source: 'credentials',
      userId: 'admin',
      email: session.user.email.toLowerCase().trim(),
    }
  }

  if (!clerkConfigured()) return null
  const { userId } = await clerkAuth()
  if (!userId) return null
  const profile = await ensureProfileForUserId(userId)
  if (!isStaffRole(profile.role)) return null
  return {
    role: profile.role,
    source: 'clerk',
    userId,
    email: profile.email,
  }
}

export async function requireStaff(): Promise<StaffActor> {
  const staff = await getStaff()
  if (staff) return staff
  if (clerkConfigured()) {
    const { userId } = await clerkAuth()
    if (userId) redirect('/admin/denied')
  }
  redirect('/admin/login')
}

export async function staffUnauthorized() {
  const staff = await getStaff()
  if (staff) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function requireCustomerId(): Promise<string | null> {
  if (!clerkConfigured()) return null
  const { userId } = await clerkAuth()
  return userId
}

export async function requireCustomerProfile() {
  const userId = await requireCustomerId()
  if (!userId) return null
  return ensureProfileForUserId(userId)
}

export type { ProfileRole }
