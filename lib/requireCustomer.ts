import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { clerkConfigured } from '@/lib/clerkEnv'
import { ensureProfileForUserId } from '@/lib/profiles'

export async function requireSignedInProfile() {
  if (!clerkConfigured()) redirect('/sign-in')
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  await currentUser()
  return ensureProfileForUserId(userId)
}
