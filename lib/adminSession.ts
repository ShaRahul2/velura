import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase().trim()) redirect('/admin/login')
  return session
}
