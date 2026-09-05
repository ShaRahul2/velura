<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cloud Agent development

- **Install:** `./.cursor/scripts/install.sh` — `npm ci`, Prisma generate, `db:push`, `db:seed` (creates `.env.local` with local Postgres defaults if missing).
- **Start:** `./.cursor/scripts/start.sh` — starts PostgreSQL, then `next dev` on port 3000.
- **Tests:** `node --import tsx --test tests/admin.test.ts`
- **Lint:** `npm run lint`
- Local admin login: `admin@velura.local` / `velura-admin-dev` (from `.env.local`).
