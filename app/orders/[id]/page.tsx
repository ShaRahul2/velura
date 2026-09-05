import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireSignedInProfile } from '@/lib/requireCustomer'
import { db } from '@/lib/db'
import { toPublicOrder } from '@/lib/orderPublic'
import { OrderStatusView } from '@/components/order/OrderStatusView'
import { pageWrap } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Order',
  robots: { index: false, follow: false },
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireSignedInProfile()
  const { id } = await params
  const order = await db.order.findFirst({
    where: { id, profileId: profile.id },
    include: { items: true },
  })
  if (!order) notFound()

  return (
    <div className={`${pageWrap} max-w-[40rem] py-14 md:py-20`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        <Link href="/orders" className="underline underline-offset-4">Orders</Link>
        {' · '}
        {order.id}
      </p>
      <h1
        className="mb-10 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        This order.
      </h1>
      <OrderStatusView order={toPublicOrder(order)} />
    </div>
  )
}
