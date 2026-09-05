import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdminApi } from '@/lib/adminSession'
import { canChangeRole } from '@/lib/profileRole'
import { isClerkConfigured } from '@/lib/clerkConfig'

const bodySchema = z.object({
  role: z.enum(['customer', 'manager', 'admin']),
})

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const actor = await requireAdminApi()
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const target = await db.profile.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  const otherAdminCount = await db.profile.count({
    where: { role: 'admin', id: { not: target.id } },
  })
  const allowed = canChangeRole({
    actor,
    targetId: target.id,
    targetRole: target.role,
    nextRole: parsed.data.role,
    otherAdminCount,
  })
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.error }, { status: 403 })
  }

  const updated = await db.profile.update({
    where: { id: target.id },
    data: { role: parsed.data.role },
  })

  if (isClerkConfigured()) {
    try {
      const client = await clerkClient()
      await client.users.updateUserMetadata(target.id, {
        publicMetadata: { role: parsed.data.role },
      })
    } catch {
      /* Clerk metadata is best-effort; SQL role is canonical */
    }
  }

  return NextResponse.json({ data: updated })
}
