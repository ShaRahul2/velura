# Velura Project Audit Report

Generated: 2026-05-24  
Scope: Static code/config review plus `npm run lint`. No source files were modified. `.env.local` values were not inspected.

## Quick Status

- The app is no longer just scaffolded: core pages, product listing/detail, cart, checkout UI, builder UI, Prisma product schema, seed data, and product API routes exist.
- The main lag is between a polished storefront prototype and production readiness: orders, saved designs, payments, validation, SEO, tests, and deployment hardening are still shallow or missing.
- `npm run lint` currently fails: 5 errors and 13 warnings.
- `TASKS.md`, `CLAUDE.md`, and `README.md` are stale against the actual implementation and stack.
- Existing uncommitted work was present before this audit; this report is the only file intentionally added.

## Existing Strengths

- Uses Next.js App Router with Next `16.2.6`, React `19.2.4`, TypeScript strict mode, Tailwind CSS v4 theme tokens, Zustand, Prisma, and App Router route handlers.
- Strong brand system already exists in `app/globals.css`, `CLAUDE.md`, and component styling: Onyx & Pearl tokens, editorial copy, sharp-radius UI, and consistent premium direction.
- Product catalog exists in `data/products.ts` with 15 products and seeded database conversion in `prisma/seed.ts`.
- Product listing/detail paths have moved toward server-side data via Prisma in `app/shop/page.tsx`, `app/shop/[id]/page.tsx`, and `lib/products.ts`.
- Cart, builder, filters, pagination, checkout forms, and product galleries are already componentized.

## P0 Launch Blockers

### 1. Lint Fails

`npm run lint` exits with code 1.

- Errors: unescaped apostrophes/quotes in `app/order-confirmed/page.tsx`, `components/home/Newsletter.tsx`, and `components/home/Testimonials.tsx`.
- Warnings: unused coupon state, unused imports/props, unused variables in builder/store/home/shop files.
- Impact: CI/build pipelines with lint checks will fail before deploy.

### 2. Checkout Success Page Cannot Show Order ID

- Checkout redirects with `?id=` in `app/checkout/page.tsx:75`.
- Confirmation page reads `order` from search params in `app/order-confirmed/page.tsx:9`.
- Impact: users reach the success page, but the order number is silently missing.

### 3. Orders Are Not Persisted

- `prisma/schema.prisma` only has `Category`, `Product`, `ProductImage`, and `Review` models.
- `app/api/orders/route.ts:19` generates a timestamp/random order ID and returns it without database writes.
- Missing models: `Order`, `OrderItem`, address/shipping fields, payment status, coupon/discount fields.
- Impact: no admin/order history, no fulfillment trail, no reliable confirmation, no recovery after failure.

### 4. Server-Side Order Validation Is Too Thin

- `app/api/orders/route.ts:10` casts request data to `OrderItem[]` and `Address` without schema validation.
- Prices, totals, product IDs, custom item shape, COD limit, coupon discounts, and payment method validity are not verified server-side.
- `app/checkout/page.tsx:73` clears the cart after parsing JSON, without checking `res.ok`.
- Impact: bad or manipulated client payloads can create incorrect orders once persistence is added.

### 5. Fit Calculator Gives Bad CM Band Sizes

- `lib/fitCalculator.ts:13` converts inches to cm, then `lib/fitCalculator.ts:17` treats cm as the final bra band.
- Example: `76cm` underbust becomes band `44` after clamp, instead of a realistic 30/32/34-style band.
- Impact: the fit calculator can recommend incorrect sizes for the default `cm` mode.

### 6. Claimed Size Range Is Not Actually Supported

- Marketing says `28AA–50H`, and products include `34C–50H`.
- `components/product/ProductDetail.tsx:14` only parses bands through `44`.
- `components/product/SizeSelector.tsx:5` only renders sizes up to `44DD`.
- Builder fit calculator clamps to `44` in `lib/fitCalculator.ts:20`.
- Impact: plus-size promise is undercut at product selection and fit recommendation.

### 7. Cart Mutations Break Multi-Size Items

- Cart add merges by `id + size` in `store/cartStore.ts:21`.
- Remove and quantity update operate only by `id` in `store/cartStore.ts:36` and `store/cartStore.ts:40`.
- Impact: if the same product is added in two sizes, removing or changing quantity can affect both sizes.

### 8. Quick Add Uses Invalid Size

- Product card quick-add inserts `size: 'M'` in `components/shop/ProductCard.tsx:65`.
- Bra products use band/cup sizing, not apparel sizes.
- Impact: cart and order data can contain impossible sizes.

## P1 Core Gaps

### Data Consistency

- Home featured products use static `data/products.ts` in `components/home/FeaturedProducts.tsx:2`.
- Shop and detail pages use Prisma via `lib/products.ts` and `app/shop/page.tsx:24`.
- Impact: home and shop can drift if database data changes or if seed data is not current.

### Saved Designs Are Stubbed

- `app/api/saved-designs/route.ts:3` always returns an empty array.
- `app/api/saved-designs/route.ts:10` returns a generated ID but stores nothing.
- No `SavedDesign` model exists in `prisma/schema.prisma`.
- Impact: builder designs cannot be recovered, shared, or used for repeat purchase.

### Coupon UI Is Not Wired

- `COUPONS`, `coupon`, `setCoupon`, and `setDiscount` are defined in `app/checkout/page.tsx:24` and `app/checkout/page.tsx:37` but unused.
- `components/checkout/OrderSummaryPanel.tsx` renders coupon input/button but has no state or callback.
- Missing `/api/coupons/validate`.
- Impact: coupon UI looks real but does nothing.

### Payment Flow Is UI-Only

- Razorpay is installed in `package.json:24`, and the checkout copy says Razorpay-secured.
- There is no `lib/razorpay.ts`, order creation with Razorpay, payment verification route, webhook route, or payment status persistence.
- Impact: UPI/card/netbanking options are not functional payments yet.

### Cloudinary Is Not Implemented

- Cloudinary packages and env vars exist, and `next.config.ts` allows `res.cloudinary.com`.
- There is no `lib/cloudinary.ts`, upload flow, transformation helper, or production image workflow.
- Product images still use Unsplash URLs from `data/products.ts`.
- Impact: image ownership, optimization strategy, and production catalog readiness are incomplete.

### Missing Route States

- No `loading.tsx`, `error.tsx`, or route-level `not-found.tsx` files exist under `app`.
- Product detail uses `notFound()`, but no branded not-found UI is present.
- Impact: slow/failing DB routes will feel abrupt and less premium.

### SEO Is Basic

- Root, shop, builder, and product metadata exist.
- Missing: Open Graph/Twitter metadata, product JSON-LD, `app/sitemap.ts`, `app/robots.ts`, manifest, branded OG images, checkout/order noindex strategy.
- Next local docs reviewed: Metadata APIs support static `metadata`, dynamic `generateMetadata`, and metadata file conventions for sitemap/robots/OG.

## P2 Improvement Opportunities

### Product Experience

- Add wishlist, recently viewed, size guide, related-product carousel states, review display, stock/availability, and actual product variant data.
- Move product categories and hero/featured sections to DB-backed content or CMS-like config to avoid static drift.
- Add blur placeholders and explicit image alt metadata from `ProductImage.alt`.

### Builder Experience

- Persist builder progress/designs locally before POST.
- Add shareable design URLs.
- Use labels instead of internal IDs in custom product names.
- Avoid `Date.now()` as custom cart item ID in `components/builder/Step5Review.tsx:40`; use stable client IDs that cannot collide with product IDs.
- Add mobile preview or sticky summary; currently preview is hidden on mobile.

### Checkout Experience

- Add field-level validation for email, phone, PIN, UPI ID, and COD eligibility.
- Make totals single-source-of-truth between checkout page and order summary panel.
- Add order failure state, retry path, and clear-cart only after successful server response.

### Accessibility

- Drawers should trap focus, close on Escape, restore focus to trigger, and expose dialog semantics.
- Icon-only buttons generally have labels, but filter/cart drawers need fuller keyboard review.
- Add reduced-motion consideration for marquees/animations.

### Security / Reliability

- Add schema validation with a library such as Zod for all POST routes.
- Add rate limiting or bot protection for order, saved design, fit calculator, and newsletter endpoints.
- Add security headers in `next.config.ts` or middleware.
- Avoid trusting client prices or totals.
- Add error logging/observability before launch.

## Documentation Lag

- `README.md:1` is still the default create-next-app README and does not describe Velura, env setup, DB setup, seed commands, or launch steps.
- `TASKS.md:19` says Next.js 14 scaffold is not started, but the project is already on Next `16.2.6` in `package.json:21`.
- `CLAUDE.md` says Next.js 14 and Tailwind v3, but the app uses Next 16 and Tailwind v4 `@theme`.
- Several tasks marked not started appear partly or fully implemented; the task board needs reconciliation before planning.

## Testing / QA Lag

- No test script exists in `package.json`.
- No unit test framework is configured for fit calculation, builder pricing, cart logic, or product query logic.
- No E2E tests exist for browse → add to bag → checkout → confirmation.
- No CI workflow is visible.
- `npm run build` was not run during this audit to avoid writing build artifacts; build/typegen verification is still needed.

## Suggested Implementation Order

1. Fix lint errors/warnings and the confirmation query mismatch.
2. Fix fit calculator sizing and expand size support to `50H`.
3. Fix cart item identity to use a cart-line ID or `id + size + custom signature`.
4. Add order/customer/order-item Prisma models and persist `POST /api/orders`.
5. Add server-side validation for orders, fit calculator, saved designs, coupons, and newsletter.
6. Wire coupon state and centralize checkout totals.
7. Add Razorpay create/verify/webhook flow or downgrade UI copy until payments are real.
8. Implement saved designs persistence and builder local recovery.
9. Add SEO files, product structured data, branded not-found/loading/error screens.
10. Add unit tests for `fitCalculator`, `cartStore`, builder pricing, and product queries, then add E2E smoke tests.
11. Update `README.md`, `TASKS.md`, and `CLAUDE.md` to match actual Next 16/Tailwind 4 implementation.
12. Add deployment checklist: env vars, DB migration/seed, Vercel settings, analytics, monitoring.

## Tool Findings

### `npm run lint`

Result: failed with 5 errors and 13 warnings.

Key files:

- `app/order-confirmed/page.tsx`
- `components/home/Newsletter.tsx`
- `components/home/Testimonials.tsx`
- `app/checkout/page.tsx`
- `components/builder/CustomBraBuilder.tsx`
- `components/builder/Step5Review.tsx`
- `components/checkout/AddressForm.tsx`
- `components/home/HeroSection.tsx`
- `components/shop/ProductCard.tsx`
- `store/builderStore.ts`

### Commands Not Run

- `npm run build`: skipped because it writes `.next` output.
- `npm run db:*`: skipped because DB commands may mutate local/remote database state.
- Dependency freshness/security audit requiring network: skipped due restricted network and because the request was for a non-mutating audit.
