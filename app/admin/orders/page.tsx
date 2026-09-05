import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import type { PaymentStatus, OrderStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Unpaid',
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}

const ORDER_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function loadOrders() {
  return db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

function tone(status: string) {
  if (status === 'paid' || status === 'delivered' || status === 'confirmed') {
    return 'text-[#EDE9E4]'
  }
  if (status === 'failed' || status === 'cancelled') {
    return 'text-[#C4A090]'
  }
  return 'text-[rgba(237,233,228,0.55)]'
}

export default async function AdminOrdersPage() {
  const emptyCounts: { paymentStatus: PaymentStatus; _count: number; _sum: { total: number | null } }[] = []
  let orders: Awaited<ReturnType<typeof loadOrders>> = []
  let paymentCounts = emptyCounts

  try {
    ;[orders, paymentCounts] = await Promise.all([
      loadOrders(),
      db.order.groupBy({
        by: ['paymentStatus'],
        _count: true,
        _sum: { total: true },
      }),
    ])
  } catch {
    orders = []
    paymentCounts = emptyCounts
  }

  const totalOrders = paymentCounts.reduce((n, r) => n + r._count, 0)
  const totalValue = paymentCounts.reduce((n, r) => n + (r._sum.total ?? 0), 0)
  const byStatus = Object.fromEntries(
    paymentCounts.map((r) => [r.paymentStatus, { count: r._count, sum: r._sum.total ?? 0 }]),
  ) as Record<string, { count: number; sum: number }>

  const stats = [
    { label: 'Orders', value: String(totalOrders), sub: formatPrice(totalValue) },
    { label: 'Paid', value: String(byStatus.paid?.count ?? 0), sub: formatPrice(byStatus.paid?.sum ?? 0) },
    { label: 'Pending', value: String((byStatus.pending?.count ?? 0) + (byStatus.unpaid?.count ?? 0)), sub: 'Awaiting payment or COD' },
    { label: 'Failed', value: String(byStatus.failed?.count ?? 0), sub: 'Signature or capture failed' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-[1.4rem] font-light tracking-[-0.01em] text-[#EDE9E4]">
          Orders
        </h1>
        <p className="mt-0.5 text-[0.72rem] text-[rgba(237,233,228,0.35)]">
          Latest 100 · payment and fulfilment
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-px bg-[rgba(184,168,152,0.12)] lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#141210] px-5 py-4">
            <p className="font-sans text-[0.62rem] tracking-[0.12em] uppercase text-[#B8A898]">
              {s.label}
            </p>
            <p className="mt-2 font-serif text-[1.6rem] font-light text-[#EDE9E4]">{s.value}</p>
            <p className="mt-1 font-sans text-[0.68rem] text-[rgba(237,233,228,0.35)]">{s.sub}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="font-serif text-[1.1rem] font-light text-[rgba(237,233,228,0.45)]">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[4px] border border-[rgba(184,168,152,0.1)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(184,168,152,0.1)] bg-[rgba(237,233,228,0.03)]">
                {['Order', 'Customer', 'Items', 'Method', 'Payment', 'Fulfilment', 'Total'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-sans text-[0.62rem] font-normal uppercase tracking-[0.12em] text-[rgba(237,233,228,0.35)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[rgba(184,168,152,0.07)] last:border-0"
                >
                  <td className="px-4 py-3 align-top">
                    <p className="font-sans text-[0.78rem] text-[#EDE9E4]">{order.id}</p>
                    <p className="mt-0.5 font-sans text-[0.65rem] text-[rgba(237,233,228,0.35)]">
                      {order.createdAt.toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-sans text-[0.78rem] text-[#EDE9E4]">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="mt-0.5 font-sans text-[0.65rem] text-[rgba(237,233,228,0.35)]">
                      {order.city}, {order.pinCode}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top font-sans text-[0.72rem] text-[rgba(237,233,228,0.65)]">
                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.qty} × {item.name}
                        <span className="text-[rgba(237,233,228,0.35)]"> · {item.size}</span>
                      </p>
                    ))}
                  </td>
                  <td className="px-4 py-3 align-top font-sans text-[0.72rem] uppercase tracking-[0.08em] text-[rgba(237,233,228,0.65)]">
                    {order.paymentMethod}
                  </td>
                  <td className={`px-4 py-3 align-top font-sans text-[0.72rem] ${tone(order.paymentStatus)}`}>
                    {PAYMENT_LABEL[order.paymentStatus]}
                    {order.paidAt && (
                      <p className="mt-0.5 text-[0.62rem] text-[rgba(237,233,228,0.35)]">
                        {order.paidAt.toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </td>
                  <td className={`px-4 py-3 align-top font-sans text-[0.72rem] ${tone(order.status)}`}>
                    {ORDER_LABEL[order.status]}
                  </td>
                  <td className="px-4 py-3 align-top font-sans text-[0.82rem] tabular-nums text-[#EDE9E4]">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
