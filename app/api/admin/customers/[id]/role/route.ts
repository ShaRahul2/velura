import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getStaff } from '@/lib/staffAuth'
import { canChangeRole, isProfileRole } from '@/lib/accountRoles'
import { clerkClient } from '@clerk/nextjs/server'
import { clerkConfigured } from '@/lib/clerkEnv'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaff()
  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (staff.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const parsed = z.object({ role: z.string() }).safeParse(await req.json().catch(() => null))
  if (!parsed.success || !isProfileRole(parsed.data.role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const target = await db.profile.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!canChangeRole(staff.role, target.role, parsed.data.role)) {
    return NextResponse.json({ error: 'That role cannot be changed here' }, { status: 403 })
  }

  const updated = await db.profile.update({
    where: { id },
    data: { role: parsed.data.role },
  })

  if (clerkConfigured()) {
    try {
      const clerk = await clerkClient()
      await clerk.users.updateUserMetadata(id, {
        publicMetadata: { role: parsed.data.role },
      })
    } catch (err) {
      console.error('[admin role] clerk metadata', err)
    }
  }

  return NextResponse.json({ data: { id: updated.id, role: updated.role } })
}
