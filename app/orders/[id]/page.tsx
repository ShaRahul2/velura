import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireCustomerProfile } from '@/lib/customerAuth'
import { getCustomerOrder } from '@/lib/customerOrders'
import { OrderStatusView } from '@/components/order/OrderStatusView'
import { pageWrap } from '@/lib/utils'
import { isClerkConfigured } from '@/lib/clerkConfig'
import { AuthUnavailable } from '@/components/account/AuthUnavailable'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isClerkConfigured()) return <AuthUnavailable />
  const { id } = await params
  const profile = await requireCustomerProfile()
  const order = await getCustomerOrder(profile.id, decodeURIComponent(id))
  if (!order) notFound()

  return (
    <div className={`${pageWrap} max-w-[40rem] py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Order</p>
      <h1
        className="mb-8 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '-0.01em' }}
      >
        {order.id}
      </h1>
      <OrderStatusView order={order} />
      <Link
        href="/orders"
        className="mt-10 inline-block font-sans text-[0.72rem] tracking-btn uppercase text-deep underline underline-offset-4"
      >
        All orders
      </Link>
    </div>
  )
}
