import { PrismaClient, ProfileRole } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const id = process.argv[2]
  const role = (process.argv[3] ?? 'admin') as ProfileRole
  if (!id || !['admin', 'manager', 'customer'].includes(role)) {
    console.error('Usage: npx tsx prisma/grant-admin.ts <clerkUserId> [admin|manager|customer]')
    process.exit(1)
  }
  const profile = await db.profile.upsert({
    where: { id },
    create: { id, email: `${id}@users.velura.local`, role },
    update: { role },
  })
  console.log(`Updated ${profile.id} (${profile.email}) → ${profile.role}`)
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
