import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { isClerkConfigured } from '@/lib/clerkConfig'
import { parseProfileRole, type ProfileRoleName } from '@/lib/profileRole'
import type { Profile } from '@prisma/client'

export type ClerkIdentity = {
  id: string
  email: string
  fullName: string | null
  phone: string | null
  avatarUrl: string | null
  metadataRole: ProfileRoleName | null
}

export async function readClerkIdentity(): Promise<ClerkIdentity | null> {
  if (!isClerkConfigured()) return null
  try {
    const user = await currentUser()
    if (!user) return null
    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ''
    if (!email) return null
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.fullName
    const phone = user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber ?? null
    return {
      id: user.id,
      email,
      fullName: fullName || null,
      phone,
      avatarUrl: user.imageUrl || null,
      metadataRole: parseProfileRole(user.publicMetadata?.role),
    }
  } catch {
    return null
  }
}

export async function upsertProfileFromIdentity(identity: {
  id: string
  email: string
  fullName?: string | null
  phone?: string | null
  avatarUrl?: string | null
  metadataRole?: ProfileRoleName | null
}): Promise<Profile> {
  const existing = await db.profile.findUnique({ where: { id: identity.id } })
  if (!existing) {
    return db.profile.create({
      data: {
        id: identity.id,
        email: identity.email,
        fullName: identity.fullName ?? null,
        phone: identity.phone ?? null,
        avatarUrl: identity.avatarUrl ?? null,
        role: identity.metadataRole ?? 'customer',
      },
    })
  }
  return db.profile.update({
    where: { id: identity.id },
    data: {
      email: identity.email,
      ...(identity.avatarUrl ? { avatarUrl: identity.avatarUrl } : {}),
      ...(identity.metadataRole && existing.role === 'customer' ? { role: identity.metadataRole } : {}),
    },
  })
}

export async function requireCustomerProfile(): Promise<Profile> {
  const identity = await readClerkIdentity()
  if (!identity) {
    const error = new Error('Unauthorized')
    error.name = 'UnauthorizedError'
    throw error
  }
  return upsertProfileFromIdentity(identity)
}

export async function getOptionalProfile(): Promise<Profile | null> {
  const identity = await readClerkIdentity()
  if (!identity) return null
  return upsertProfileFromIdentity(identity)
}
