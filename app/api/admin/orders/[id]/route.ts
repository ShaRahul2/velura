import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface Context {
  params: Promise<{ id: string }>
}

const Body = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
})

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await db.order.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    return NextResponse.json({ data: { id: order.id, status: order.status } })
  } catch (err) {
    console.error('[PATCH /api/admin/orders/[id]]', err)
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }
}
