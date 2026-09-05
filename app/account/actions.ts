'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireSignedInProfile } from '@/lib/requireCustomer'

const ProfileSchema = z.object({
  fullName: z.string().trim().max(80).optional().default(''),
  phone: z.string().trim().regex(/^(\d{10})?$/, 'Phone must be 10 digits').optional().default(''),
})

const AddressSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(1).max(40),
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  phone: z.string().trim().regex(/^(\d{10})?$/).optional().default(''),
  line1: z.string().trim().min(5).max(200),
  line2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'PIN must be 6 digits'),
  country: z.string().trim().min(2).max(2).optional().default('IN'),
  isDefault: z.boolean().optional().default(false),
})

export async function updateProfileAction(formData: FormData) {
  const profile = await requireSignedInProfile()
  const parsed = ProfileSchema.safeParse({
    fullName: String(formData.get('fullName') ?? ''),
    phone: String(formData.get('phone') ?? ''),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid profile' }
  await db.profile.update({
    where: { id: profile.id },
    data: {
      fullName: parsed.data.fullName || null,
      phone: parsed.data.phone || null,
    },
  })
  revalidatePath('/account')
  return { ok: true as const }
}

export async function saveAddressAction(formData: FormData) {
  const profile = await requireSignedInProfile()
  const parsed = AddressSchema.safeParse({
    id: String(formData.get('id') ?? '') || undefined,
    label: String(formData.get('label') ?? 'Home'),
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    line1: String(formData.get('line1') ?? ''),
    line2: String(formData.get('line2') ?? ''),
    city: String(formData.get('city') ?? ''),
    state: String(formData.get('state') ?? ''),
    postalCode: String(formData.get('postalCode') ?? ''),
    isDefault: formData.get('isDefault') === 'on' || formData.get('isDefault') === 'true',
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the address.' }

  const data = {
    label: parsed.data.label,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    phone: parsed.data.phone || null,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postalCode,
    country: 'IN',
    isDefault: parsed.data.isDefault,
  }

  await db.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({ where: { profileId: profile.id }, data: { isDefault: false } })
    }
    if (parsed.data.id) {
      const owned = await tx.address.findFirst({ where: { id: parsed.data.id, profileId: profile.id } })
      if (!owned) throw new Error('Address not found')
      await tx.address.update({ where: { id: owned.id }, data })
    } else {
      const count = await tx.address.count({ where: { profileId: profile.id } })
      await tx.address.create({
        data: {
          ...data,
          isDefault: data.isDefault || count === 0,
          profileId: profile.id,
        },
      })
    }
  })

  revalidatePath('/account')
  revalidatePath('/checkout')
  return { ok: true as const }
}

export async function deleteAddressAction(formData: FormData) {
  const profile = await requireSignedInProfile()
  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Missing address' }
  const owned = await db.address.findFirst({ where: { id, profileId: profile.id } })
  if (!owned) return { error: 'Address not found' }
  await db.address.delete({ where: { id: owned.id } })
  if (owned.isDefault) {
    const next = await db.address.findFirst({ where: { profileId: profile.id }, orderBy: { createdAt: 'asc' } })
    if (next) await db.address.update({ where: { id: next.id }, data: { isDefault: true } })
  }
  revalidatePath('/account')
  return { ok: true as const }
}

export async function setDefaultAddressAction(formData: FormData) {
  const profile = await requireSignedInProfile()
  const id = String(formData.get('id') ?? '')
  const owned = await db.address.findFirst({ where: { id, profileId: profile.id } })
  if (!owned) return { error: 'Address not found' }
  await db.$transaction([
    db.address.updateMany({ where: { profileId: profile.id }, data: { isDefault: false } }),
    db.address.update({ where: { id: owned.id }, data: { isDefault: true } }),
  ])
  revalidatePath('/account')
  return { ok: true as const }
}
