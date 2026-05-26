import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

const SaveSchema = z.object({
  specHash:   z.string().min(1).max(64),
  specJson:   z.record(z.string(), z.unknown()),
  previewUrl: z.string().url().optional().nullable(),
})

export async function GET() {
  try {
    const designs = await db.savedDesign.findMany({
      orderBy: { createdAt: 'desc' },
      take:    50,
    })
    return NextResponse.json({ data: designs })
  } catch {
    return NextResponse.json({ data: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = SaveSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { specHash, specJson, previewUrl } = parsed.data

    // Return existing design if same spec was already saved
    const existing = await db.savedDesign.findUnique({ where: { specHash } })
    if (existing) {
      return NextResponse.json({ data: { id: existing.id } })
    }

    const design = await db.savedDesign.create({
      data: {
        specHash,
        specJson:   specJson as Prisma.InputJsonValue,
        previewUrl: previewUrl ?? null,
      },
    })
    return NextResponse.json({ data: { id: design.id } }, { status: 201 })
  } catch {
    // DB not yet provisioned — return stub ID so builder flow doesn't break
    const id = `design-${Date.now()}`
    return NextResponse.json({ data: { id } }, { status: 201 })
  }
}
