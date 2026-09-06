import { requireStaff } from '@/lib/staffAuth'

export const dynamic = 'force-dynamic'

/**
 * Single enforced gate for every real admin screen. `requireStaff()` redirects
 * to /admin/login (no session) or /admin/denied (signed in, not staff), so a
 * page that forgets its own check can never render. /admin/login, /admin/denied
 * and /admin/forbidden sit outside this group and stay reachable.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireStaff()
  return <>{children}</>
}
