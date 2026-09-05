import Link from 'next/link'
import { requireCustomerProfile } from '@/lib/customerAuth'
import { listCustomerOrders } from '@/lib/customerOrders'
import { formatOrderDate, formatOrderMoney } from '@/lib/orderPublic'
import { pageWrap } from '@/lib/utils'
import { isClerkConfigured } from '@/lib/clerkConfig'
import { AuthUnavailable } from '@/components/account/AuthUnavailable'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  if (!isClerkConfigured()) return <AuthUnavailable />
  const profile = await requireCustomerProfile()
  const orders = await listCustomerOrders(profile.id)

  return (
    <div className={`${pageWrap} py-12 md:py-16`}>
      <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">Orders</p>
      <h1
        className="mb-10 font-serif font-light text-deep"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', letterSpacing: '-0.01em' }}
      >
        Worn once. Remembered forever.
      </h1>
      {orders.length === 0 ? (
        <div>
          <p className="mb-6 font-sans text-[0.95rem] font-light text-mauve">Nothing placed yet.</p>
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
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
              <div>
                <p className="font-sans text-[0.82rem] text-deep">{order.id}</p>
                <p className="font-sans text-[0.75rem] text-mauve">
                  {formatOrderDate(order.createdAt)} · {order.fulfilment} · {formatOrderMoney(order.total)}
                </p>
              </div>
              <Link
                href={`/orders/${encodeURIComponent(order.id)}`}
                className="font-sans text-[0.72rem] tracking-btn uppercase text-deep underline underline-offset-4"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
