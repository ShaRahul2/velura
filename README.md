# Velura

Premium Indian lingerie storefront. Next.js App Router.

## Getting Started

Cloud Agent / local scripts:

```bash
./.cursor/scripts/install.sh
./.cursor/scripts/start.sh
```

Or by hand:

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin desk: `/admin` — `admin@velura.local` / `velura-admin-dev` when using local defaults.

## Auth, accounts, and admin

Customer SSO is **Clerk** (Google + email). Cart, wishlist, orders, and `/account` persist on Neon via Prisma.

Full setup (Vercel env vars, webhook, first admin): **[docs/accounts.md](docs/accounts.md)**.

Admin catalogue/orders still work with the existing NextAuth operator (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and also with Clerk users whose `Profile.role` is `manager` or `admin`.

```bash
npx prisma db push
npm test
```

## Deploy on Vercel

Production origin: `https://www.thevelura.in`. Copy variables from `env.production.example`. After adding Clerk keys, redeploy so `NEXT_PUBLIC_*` is inlined.
