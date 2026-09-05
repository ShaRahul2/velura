import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/adminSession'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { formatAdminDate } from '@/lib/adminOrders'
import { RoleSelect } from '@/components/admin/RoleSelect'
import { AdminHeader, SearchForm, Pagination, Empty, param, pageNumber, type AdminParams } from '@/components/admin/AdminUI'

export const dynamic = 'force-dynamic'

export default async function Customers({ searchParams }: { searchParams: Promise<AdminParams> }) {
  const actor = await requireAdmin()
  const params = await searchParams
  const q = param(params, 'q')
  const page = pageNumber(params)
  const canEditRoles = actor.role === 'admin'

  const profileWhere = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { fullName: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}
  const [profiles, profileTotal] = await Promise.all([
    db.profile.findMany({
      where: profileWhere,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 25,
      take: 25,
    }),
    db.profile.count({ where: profileWhere }),
  ])

  const where = { email: { contains: q, mode: 'insensitive' as const } }
  const rows = await db.order.groupBy({
    by: ['email'],
    where,
    _count: true,
    _sum: { total: true },
    _max: { createdAt: true },
    orderBy: { email: 'asc' },
    skip: (page - 1) * 25,
    take: 26,
  })
  const counts = await db.$queryRaw<{ count: bigint }[]>(
    Prisma.sql`SELECT COUNT(DISTINCT email) AS count FROM "Order" WHERE POSITION(LOWER(${q}) IN LOWER(email)) > 0`,
  )
  const total = Number(counts[0]?.count ?? 0)
  const shown = rows.slice(0, 25)

  return (
    <div className="admin-page">
      <AdminHeader
        title="Customers"
        description="Signed-in accounts live in profiles. Guest checkouts remain grouped by email. Managers cannot change roles."
      />
      <SearchForm q={q} placeholder="Search name or email" />

      <h2 className="admin-section-title">Accounts</h2>
      {profiles.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {['Email', 'Name', 'Role', 'Joined'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.email}</td>
                  <td>{profile.fullName ?? '—'}</td>
                  <td>
                    <RoleSelect profile={profile} canEdit={canEditRoles} />
                  </td>
                  <td>{formatAdminDate(profile.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>No accounts match these filters.</Empty>
      )}
      <Pagination page={page} total={Math.max(total, profileTotal)} params={params} />

      <h2 className="admin-section-title">Checkout emails</h2>
      {shown.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {['Customer email', 'Orders', 'Order value', 'Latest order', 'History'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.email}>
                  <td>{r.email}</td>
                  <td>{r._count}</td>
                  <td>{formatPrice(r._sum.total ?? 0)}</td>
                  <td>{formatAdminDate(r._max.createdAt)}</td>
                  <td>
                    <Link className="admin-link" href={`/admin/orders?email=${encodeURIComponent(r.email)}`}>
                      View orders
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>No checkout emails match these filters.</Empty>
      )}
    </div>
  )
}
