import { Prisma } from '@prisma/client'
import { currentUser, type User } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { parseClerkRole, type ProfileRole } from '@/lib/accountRoles'

export { clerkConfigured } from '@/lib/clerkEnv'

export function profileFromClerkUser(user: Pick<User, 'id' | 'fullName' | 'imageUrl' | 'primaryEmailAddress' | 'publicMetadata'>) {
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase().trim() ?? ''
  const metaRole = parseClerkRole(user.publicMetadata)
  return {
    id: user.id,
    email,
    fullName: user.fullName,
    avatarUrl: user.imageUrl,
    role: metaRole,
  }
}

export async function upsertProfileFromClerk(input: {
  id: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
  phone?: string | null
  role?: ProfileRole | null
}) {
  const existing = await db.profile.findUnique({ where: { id: input.id } })
  const email = input.email.toLowerCase().trim() || existing?.email || `${input.id}@users.velura.local`
  const data = {
    email,
    fullName: input.fullName ?? existing?.fullName ?? null,
    avatarUrl: input.avatarUrl ?? existing?.avatarUrl ?? null,
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.role ? { role: input.role } : {}),
  }
  if (!existing) {
    return db.profile.create({
      data: {
        id: input.id,
        role: input.role ?? 'customer',
        ...data,
      },
    })
  }
  return db.profile.update({ where: { id: input.id }, data })
}

export async function ensureProfileForUserId(userId: string) {
  const existing = await db.profile.findUnique({ where: { id: userId } })
  if (existing) return existing
  const user = await currentUser()
  if (!user || user.id !== userId) {
    return db.profile.create({
      data: { id: userId, email: `${userId}@users.velura.local`, role: 'customer' },
    })
  }
  const fromClerk = profileFromClerkUser(user)
  return upsertProfileFromClerk(fromClerk)
}

export type ProfileRecord = Prisma.ProfileGetPayload<{ include: { addresses: true } }>
