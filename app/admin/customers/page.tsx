import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/adminSession'
import { getStaff } from '@/lib/staffAuth'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { formatAdminDate } from '@/lib/adminOrders'
import { AdminHeader, SearchForm, Pagination, Empty, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'
import { CustomerRoleForm } from '@/components/admin/CustomerRoleForm'

export const dynamic = 'force-dynamic'

export default async function Customers({ searchParams }: { searchParams: Promise<AdminParams> }) {
  await requireAdmin()
  const staff = await getStaff()
  const params = await searchParams
  const q = param(params, 'q')
  const page = pageNumber(params)
  const where = {
    OR: [
      { email: { contains: q, mode: 'insensitive' as const } },
      { fullName: { contains: q, mode: 'insensitive' as const } },
    ],
  }
  const [rows, total] = await Promise.all([
    db.profile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 25,
      take: 25,
      include: { _count: { select: { orders: true } } },
    }),
    db.profile.count({ where }),
  ])

  const guestWhere: Prisma.OrderWhereInput = {
    profileId: null,
    ...(q && { email: { contains: q, mode: 'insensitive' } }),
  }
  const guests = await db.order.groupBy({
    by: ['email'],
    where: guestWhere,
    _count: true,
    _sum: { total: true },
    _max: { createdAt: true },
    orderBy: { email: 'asc' },
    take: 20,
  })

  return (
    <div className="admin-page">
      <AdminHeader
        title="Customers"
        description="Signed-in profiles from Clerk. Guest checkout emails remain listed below. Roles: only admins can move manager ↔ customer. First admin is granted via Clerk public metadata or prisma/grant-admin.ts."
      />
      <SearchForm q={q} placeholder="Search email or name" />
      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>{['Email', 'Name', 'Role', 'Orders', 'Joined', 'History'].map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.email}</td>
                  <td>{row.fullName ?? '—'}</td>
                  <td>
                    <CustomerRoleForm
                      profileId={row.id}
                      role={row.role}
                      canEdit={staff?.role === 'admin'}
                    />
                  </td>
                  <td>{row._count.orders}</td>
                  <td>{formatAdminDate(row.createdAt)}</td>
                  <td>
                    <Link className="admin-link" href={`/admin/orders?email=${encodeURIComponent(row.email)}`}>
                      View orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>No customer profiles match these filters.</Empty>
      )}
      <Pagination page={page} total={total} params={params} />

      {guests.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-serif text-[1.2rem] font-light">Guest checkout</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>{['Email', 'Orders', 'Order value', 'Latest'].map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {guests.map((row) => (
                  <tr key={row.email}>
                    <td>{row.email}</td>
                    <td>{row._count}</td>
                    <td>{formatPrice(row._sum.total ?? 0)}</td>
                    <td>{formatAdminDate(row._max.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
