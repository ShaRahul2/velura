# Velura — Pre-Launch Checklist

Code hardening from the Sep 2026 pass is merged. What remains is environment and
account configuration that can only be done on the hosting side.

## Blockers — do not take real payments until these are done

- [ ] **Razorpay live keys.** Replace `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
      and `NEXT_PUBLIC_RAZORPAY_KEY_ID` with `rzp_live_*` values in Vercel
      (Production). Redeploy so the `NEXT_PUBLIC_` key is re-inlined.
- [ ] **Razorpay webhook secret.** In the Razorpay dashboard add a webhook to
      `https://www.thevelura.in/api/payments/webhook` (events: `payment.captured`,
      `payment.failed`, `refund.*`). Paste the signing secret as
      `RAZORPAY_WEBHOOK_SECRET`. Without it the route logs
      `RAZORPAY_WEBHOOK_SECRET is not set` and rejects every webhook, which can
      leave a paid order stuck as `pending` if the buyer closes the tab before
      the client-side verify redirect runs.
- [ ] **Smoke-test one live payment** end to end (UPI + card), then a refund,
      and confirm the order row flips to `paid` / `refunded`.

## Strongly recommended

- [ ] **Upstash Redis for rate limiting.** Create a free Upstash Redis database
      and set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Without
      these the limiter falls back to a per-process map that resets on every
      serverless cold start — the admin-login brute-force limit in particular
      is close to a no-op on Vercel without Redis.
- [ ] **Sentry.** Set `NEXT_PUBLIC_SENTRY_DSN` (and `SENTRY_ORG`,
      `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` for source-map upload during the
      build). The SDK is completely inert until a DSN is present.
- [ ] **Order email.** Verify `www.thevelura.in` in Resend, then set
      `RESEND_API_KEY` and `ORDER_FROM_EMAIL`. Order confirmation emails are
      skipped silently while `RESEND_API_KEY` is empty.

## Environment sanity

- [ ] Every var in `env.production.example` is set in Vercel (Production, and
      Preview if used).
- [ ] `NEXT_PUBLIC_APP_URL` and `AUTH_URL` are `https://www.thevelura.in`
      (not localhost, not the apex — the apex 308-redirects to `www`).
- [ ] `.env.local` and `.env.production` exist only on dev machines. They are
      gitignored; confirm `git ls-files | grep env` shows only the `*.example`
      files. Vercel's dashboard vars are the source of truth for the deploy.
- [ ] Clerk: production instance keys (`pk_live_` / `sk_live_`), webhook at
      `https://www.thevelura.in/api/webhooks/clerk` (`user.created`,
      `user.updated`), and a first admin granted via Clerk public metadata
      `{ "role": "admin" }` or `npx tsx prisma/grant-admin.ts <user_id> admin`.
- [ ] Google Maps key restricted to the production domain in Google Cloud.
- [ ] `DATABASE_URL` points at the production Neon branch; run
      `npm run db:push` (and `npm run db:seed` if starting empty) against it.

## Dependency audit (follow-up, not a blocker)

`npm audit` reports advisories in `@auth/core`, `next`/`postcss`/`sharp`,
`axios`, and `prisma`'s config deps. Clearing them needs
`npm audit fix --force`, which moves `next` and `prisma` outside their pinned
ranges — that is a deliberate, separately-tested upgrade, not part of this
hardening pass. Notes on exposure:

- `@auth/core` (critical): the advisories are OAuth-state / email-provider
  issues. Velura's NextAuth use is a single hardcoded **credentials** admin with
  no OAuth and no email provider, so they do not apply in practice.
- `next` / `postcss` / `sharp`: build-time / image-pipeline. Plan a Next
  patch-bump (16.2.x → latest 16.x) once it is out and re-run the full CI.

## Post-deploy verification

- [ ] CI is green on `main` (lint + test + build).
- [ ] `/admin` redirects a signed-out visitor to `/admin/login`, and a
      signed-in non-staff customer to `/admin/denied`.
- [ ] Security headers present on a prod response
      (`curl -sI https://www.thevelura.in | grep -i 'strict-transport\|content-security\|x-frame'`).
- [ ] `robots.txt` and `sitemap.xml` resolve and reference the `www` origin.
- [ ] Lighthouse pass on home / shop / PDP.
