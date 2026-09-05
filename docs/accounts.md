# Customer accounts (Clerk + Neon)

Velura customer identity is **Clerk**. The existing NextAuth credentials login at `/admin/login` remains as a fallback for the env-based operator (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Vercel environment

Set these on the Production (and Preview) environment, then **redeploy**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/account
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/account
DATABASE_URL
```

Keep the existing admin vars (`AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) until Clerk staff accounts are in use.

### Clerk application

1. Create a Clerk application (Google + email). Phone can stay off for now.
2. Allowed origins: `https://www.thevelura.in`, `https://thevelura.in`, and `http://localhost:3000`.
3. Enable Google SSO and email (magic link / OTP) in Clerk.
4. Session token (optional, for faster admin proxy): add `{ "role": "{{user.public_metadata.role}}" }` — the database `Profile.role` is still the source of truth on the server.

### Webhook

Endpoint: `https://www.thevelura.in/api/webhooks/clerk`

Subscribe to `user.created` and `user.updated`. Paste the signing secret into `CLERK_WEBHOOK_SECRET`.

On first sign-in the webhook (or the first authenticated request) upserts `Profile` with role `customer`. **Never send `role` from the browser.**

## Database

Prisma models: `Profile`, `Address`, `Cart`, `CartItem`, `WishlistItem`, plus `Order.profileId`.

Totals stay **INR rupees** (existing convention), not paise.

Apply schema:

```sh
npx prisma db push
# or, if you use migrate:
npx prisma migrate deploy
```

## First admin

Pick one:

1. **Clerk Dashboard** → User → Public metadata: `{ "role": "admin" }`. Then sign in once (webhook/sync writes `Profile.role`).
2. **SQL / script** (after the user has a profile row, or to create one):

```sh
npx tsx prisma/grant-admin.ts user_2abc admin
```

Managers cannot change roles. Admins can promote/demote **manager ↔ customer** in `/admin/customers`. Admin grants stay in Clerk or this script so you cannot demote the last admin from the UI.

## Routes

| Path | Access |
|---|---|
| `/sign-in`, `/sign-up` | Public (Clerk) |
| `/account`, `/wishlist`, `/orders`, `/orders/[id]` | Signed-in customer |
| Shop, PDP, builder, marketing | Public |
| Cart drawer | Guests (localStorage) + signed-in (Neon). Guest bag merges on login. |
| `/admin/*` | NextAuth operator **or** Clerk `manager`/`admin` |
| `/order` | Guest order lookup (email + id) |

## Checklist

- [ ] Sign in with Google and with email; lands on `/account` (or `redirect_url`)
- [ ] Profile row upserted (`id` = Clerk user id)
- [ ] Edit name/phone; add a default address
- [ ] Add to bag on PDP and shop cards; quantity/remove persist after refresh and on another device when signed in
- [ ] Guest bag still works; after login, lines merge
- [ ] Wishlist heart on cards/PDP; `/wishlist` requires sign-in
- [ ] Place a stub/COD order; it appears on `/orders` and `/orders/[id]` for that user only
- [ ] Customer cannot open `/admin` (403 `/admin/denied`)
- [ ] Manager can list orders and mark shipped; cannot change roles
- [ ] Admin can set manager ↔ customer
- [ ] Sign out clears the Clerk session
