This is the Velura storefront — Next.js App Router, Prisma, Neon Postgres, Clerk customer accounts, and a NextAuth admin desk.

## Local setup

```sh
./.cursor/scripts/install.sh
./.cursor/scripts/start.sh
```

Copy `.env.example` to `.env.local` if you are not using the install script. `DATABASE_URL` is required. Clerk keys are required for `/account`, `/orders`, Google, and email sign-in.

Open [http://localhost:3000](http://localhost:3000). Admin desk: `/admin` — `admin@velura.local` / `velura-admin-dev` when using local defaults.

## Auth and accounts

Customer SSO, profiles, server cart, wishlist, order history, and staff roles are documented in [docs/auth.md](docs/auth.md). Admin workflows: [docs/admin.md](docs/admin.md).

## Tests

```sh
node --import tsx --test tests/admin.test.ts tests/account.test.ts
npx tsc --noEmit
npm run lint
```
