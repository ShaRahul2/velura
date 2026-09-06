import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

// prisma.config.ts disables Prisma's automatic .env loading, and this project
// keeps local secrets in .env.local — load it explicitly. The npm db:* scripts
// still wrap commands in `dotenv -e .env.local` too, so CI/hosted runs that set
// real env vars are unaffected.
loadEnv({ path: '.env.local' })

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
