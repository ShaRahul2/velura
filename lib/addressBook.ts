import { z } from 'zod'
import { db } from '@/lib/db'

export const addressInputSchema = z.object({
  id: z.string().cuid().optional(),
  label: z.string().min(1).max(40).default('Home'),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional().nullable(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
  country: z.string().min(2).max(4).default('IN'),
  isDefault: z.boolean().optional(),
})

export async function listAddresses(profileId: string) {
  return db.address.findMany({
    where: { profileId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })
}

export async function upsertAddress(profileId: string, input: z.infer<typeof addressInputSchema>) {
  const isDefault = input.isDefault ?? false
  return db.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({ where: { profileId }, data: { isDefault: false } })
    }
    if (input.id) {
      const owned = await tx.address.findFirst({ where: { id: input.id, profileId } })
      if (!owned) {
        const error = new Error('Address not found')
        error.name = 'NotFoundError'
        throw error
      }
      return tx.address.update({
        where: { id: input.id },
        data: {
          label: input.label,
          line1: input.line1,
          line2: input.line2 ?? null,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country ?? 'IN',
          isDefault: isDefault || owned.isDefault,
        },
      })
    }
    const count = await tx.address.count({ where: { profileId } })
    return tx.address.create({
      data: {
        profileId,
        label: input.label,
        line1: input.line1,
        line2: input.line2 ?? null,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country ?? 'IN',
        isDefault: isDefault || count === 0,
      },
    })
  })
}

export async function deleteAddress(profileId: string, id: string) {
  const owned = await db.address.findFirst({ where: { id, profileId } })
  if (!owned) {
    const error = new Error('Address not found')
    error.name = 'NotFoundError'
    throw error
  }
  await db.address.delete({ where: { id } })
  if (owned.isDefault) {
    const next = await db.address.findFirst({ where: { profileId }, orderBy: { createdAt: 'desc' } })
    if (next) {
      await db.address.update({ where: { id: next.id }, data: { isDefault: true } })
    }
  }
}
