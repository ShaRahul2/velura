import type { Metadata } from 'next'
import Link from 'next/link'
import { requireSignedInProfile } from '@/lib/requireCustomer'
import { db } from '@/lib/db'
import { formatPrice, pageWrap } from '@/lib/utils'
import { formatAdminDate } from '@/lib/adminOrders'
import { ORDER_LABEL } from '@/lib/adminOrders'

export const metadata: Metadata = {
  title: 'Orders',
  robots: { index: false, follow: false },
}

export default async function OrdersPage() {
  const profile = await requireSignedInProfile()
  const orders = await db.order.findMany({
    where: { profileId: profile.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className={`${pageWrap} py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Orders</p>
      <h1
        className="mb-10 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em' }}
      >
        Placed, not forgotten.
      </h1>

      {orders.length === 0 ? (
        <div className="max-w-md">
          <p className="mb-6 font-sans text-[0.95rem] font-light text-mauve">
            Nothing placed yet. The collection is still there.
          </p>
          <Link
            href="/shop"
            className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-deep px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-lm border-y border-lm">
          {orders.map((order) => (
            <li key={order.id} className="py-6">
              <Link href={`/orders/${order.id}`} className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose">{order.id}</p>
                  <p className="mt-1 font-serif text-[1.2rem] text-deep">
                    {ORDER_LABEL[order.status] ?? order.status}
                  </p>
                  <p className="mt-1 font-sans text-[0.78rem] text-mauve">
                    {order.items.map((item) => item.name).join(' · ')}
                  </p>
                </div>
                <div className="font-sans text-[0.88rem] text-deep">
                  {formatPrice(order.total)}
                  <span className="ml-3 text-mauve">{formatAdminDate(order.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
