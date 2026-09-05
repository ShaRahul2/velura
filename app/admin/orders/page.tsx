import { SearchForm, Pagination, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'
import { requireAdmin } from '@/lib/adminSession'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import type { Prisma, OrderStatus, PaymentStatus } from '@prisma/client'
import { ORDER_LABEL, PAYMENT_LABEL, adminTone as tone, formatAdminDate } from '@/lib/adminOrders'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<AdminParams> }) {
  await requireAdmin()
  const params = await searchParams
  const email = param(params, 'email')
  const q = param(params, 'q'); const page = pageNumber(params)
  const status = param(params, 'status'); const payment = param(params, 'payment')
  const where: Prisma.OrderWhereInput = {
    ...(email && {email: {equals:email,mode:'insensitive'}}),
    ...(q && { OR: ['id','email','firstName','lastName','phone'].map(key => ({ [key]: { contains: q, mode: 'insensitive' } })) }),
    ...(Object.keys(ORDER_LABEL).includes(status) && { status: status as OrderStatus }),
    ...(Object.keys(PAYMENT_LABEL).includes(payment) && { paymentStatus: payment as PaymentStatus }),
    ...(param(params, 'queue') === 'fulfilment' && {status: {in: ['pending','confirmed']}}),
  }
  const [orders, count, paymentCounts] = await Promise.all([
    db.order.findMany({ where, include: {items:true}, orderBy: [{createdAt:'desc'},{id:'desc'}], take:25, skip:(page-1)*25 }),
    db.order.count({where}),
    db.order.groupBy({by:['paymentStatus'], _count:true, _sum:{total:true}}),
  ])

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
          Payment and fulfilment · search all orders
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

      <SearchForm q={q} placeholder="Order, name, email or phone">
        {email && <><input type="hidden" name="email" value={email}/><p className="py-3 text-sm text-[#B8A898]">Customer: {email}</p></>}
        <label className="text-xs text-[#B8A898]">Fulfilment<select className="admin-input mt-2" name="status" defaultValue={status}><option value="">All statuses</option>{Object.entries(ORDER_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label className="text-xs text-[#B8A898]">Payment<select className="admin-input mt-2" name="payment" defaultValue={payment}><option value="">All payments</option>{Object.entries(PAYMENT_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      </SearchForm>
      {orders.length === 0 ? (
        <p className="font-serif text-[1.1rem] font-light text-[rgba(237,233,228,0.45)]">
          No orders match these filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[4px] border border-[rgba(184,168,152,0.1)]">
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
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.id)}`}
                      className="font-sans text-[0.78rem] text-[#EDE9E4] underline decoration-[rgba(184,168,152,0.25)] underline-offset-4 hover:decoration-[#EDE9E4]"
                    >
                      {order.id}
                    </Link>
                    <p className="mt-0.5 font-sans text-[0.65rem] text-[rgba(237,233,228,0.35)]">
                      {formatAdminDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-sans text-[0.78rem] text-[#EDE9E4]">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="mt-1 font-sans text-[0.68rem] text-[rgba(237,233,228,0.7)]">
                      {order.phone}
                    </p>
                    <p className="mt-0.5 font-sans text-[0.65rem] text-[rgba(237,233,228,0.45)]">
                      {order.email}
                    </p>
                    <p className="mt-0.5 font-sans text-[0.62rem] text-[rgba(237,233,228,0.35)]">
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
                        {formatAdminDate(order.paidAt)}
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
      <Pagination page={page} total={count} params={params} />
    </div>
  )
}
