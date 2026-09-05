import { PrismaClient, ProfileRole } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const target = process.argv[2]
  const role = (process.argv[3] ?? 'admin') as ProfileRole
  if (!target || !['admin', 'manager', 'customer'].includes(role)) {
    console.error('Usage: npx tsx prisma/grant-admin.ts <email-or-clerk-user-id> [admin|manager|customer]')
    process.exit(1)
  }

  const profile = target.includes('@')
    ? await db.profile.findFirst({ where: { email: { equals: target, mode: 'insensitive' } } })
    : await db.profile.upsert({
        where: { id: target },
        create: { id: target, email: `${target}@users.velura.local`, role },
        update: { role },
      })

  if (!profile) {
    console.error('No profile found for that email. Sign in once first so the webhook or first request can create it.')
    process.exit(1)
  }

  const updated =
    profile.role === role
      ? profile
      : await db.profile.update({ where: { id: profile.id }, data: { role } })

  console.log(`Updated ${updated.id} (${updated.email}) → ${updated.role}`)
  console.log('Also set Clerk Dashboard → User → public metadata: { "role": "' + role + '" }')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
