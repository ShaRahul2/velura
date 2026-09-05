# Clerk, Neon, and the first admin

Velura customer accounts use **Clerk** (Google + email). The existing NextAuth email/password desk at `/admin/login` remains for the env-based operator (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Environment

Set these on Vercel (Production + Preview) and in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

`CLERK_WEBHOOK_SIGNING_SECRET` is accepted as an alias of `CLERK_WEBHOOK_SECRET`.

Clerk dashboard URLs:

- Sign-in: `https://thevelura.in/sign-in`
- Sign-up: `https://thevelura.in/sign-up`
- After sign-in: `/account` (or the return URL Clerk captured)
- Webhook: `https://thevelura.in/api/webhooks/clerk` — subscribe to `user.created` and `user.updated`

Enable Google and email (magic link / OTP) in the Clerk application. Keep phone optional.

## Profiles

`profiles.id` is the Clerk `userId`. The webhook upserts the row as `customer`. The first authenticated request also upserts if the webhook has not run. **Role is never taken from the browser.** Client profile PATCH ignores `role`.

## Granting the first admin

1. Sign in once on the storefront so a profile row exists.
2. Run:

```sh
npx tsx prisma/grant-admin.ts you@example.com admin
```

Or SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
```

Optionally set Clerk public metadata `{ "role": "admin" }` so the webhook stays in sync.

Managers can run the admin desk (orders, products, customers) but cannot change roles. Admins can promote or demote `manager` ↔ `customer`. An admin cannot drop their own admin role unless another admin exists.

Env-based NextAuth login still has full admin rights without a Clerk profile.

## Cart and wishlist

Guests keep the bag and saved list in `localStorage`. After sign-in, guest lines merge into the server cart (`carts` / `cart_items`) and wishlist (`wishlist_items`), then persist across devices. `/cart` stays available to guests; `/account` and `/orders` require Clerk.

Orders keep existing rupee totals (not paise) so Razorpay is unchanged. Signed-in checkouts store `Order.profileId`.

## Catalog in admin

Products are already database-backed (`isActive` publish flag). No extra product CMS gap for the admin MVP.
