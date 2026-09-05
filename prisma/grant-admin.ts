import { PrismaClient, ProfileRole } from '@prisma/client'

const db = new PrismaClient()

function parseRole(value: string | undefined): ProfileRole {
  if (value === 'manager') return 'manager'
  return 'admin'
}

async function main() {
  const target = process.argv[2]
  const role = parseRole(process.argv[3])
  if (!target) {
    console.error('Usage: npx tsx prisma/grant-admin.ts <email-or-clerk-user-id> [admin|manager]')
    process.exit(1)
  }

  const profile = target.includes('@')
    ? await db.profile.findFirst({ where: { email: { equals: target, mode: 'insensitive' } } })
    : await db.profile.findUnique({ where: { id: target } })

  if (!profile) {
    console.error('No profile found. Sign in once first so the webhook or first request can create it.')
    process.exit(1)
  }

  const updated = await db.profile.update({
    where: { id: profile.id },
    data: { role },
  })
  console.log(`Granted ${updated.role} to ${updated.email} (${updated.id})`)
  console.log('Also set Clerk publicMetadata.role to the same value if you use Clerk metadata.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
