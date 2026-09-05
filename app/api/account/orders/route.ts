import { NextRequest, NextResponse } from 'next/server'
import { withCustomer } from '@/lib/withCustomer'
import { getCustomerOrder, listCustomerOrders } from '@/lib/customerOrders'

export async function GET(req: NextRequest) {
  const auth = await withCustomer()
  if (auth.error) return auth.error
  const id = new URL(req.url).searchParams.get('id')
  if (id) {
    const order = await getCustomerOrder(auth.profile.id, id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: order })
  }
  const data = await listCustomerOrders(auth.profile.id)
  return NextResponse.json({ data })
}
