# TASKS.md — Velura Project Work Items

Last updated: 2026-05-26  
Stack reality: Next.js 16.2.6 · React 19.2.4 · Tailwind CSS v4 · Prisma · Zustand · NextAuth · Cloudinary · @huggingface/inference

Status: ✅ Done · 🔄 In Progress / partial · 🧪 Needs verification · ⬜ Not Started · 🚫 Blocked  
Priority: P0 launch blocker · P1 core feature · P2 polish / growth

---

## Current Snapshot

- ✅ Full storefront: home, shop, product detail, cart drawer, checkout UI, order-confirmed page.
- ✅ Admin panel: NextAuth login, product CRUD, Cloudinary image upload/manage.
- ✅ Custom Bra Builder: 5-step flow, fit calculator, rich deterministic SVG preview, AI preview generation.
- ✅ AI Visualizer (EPIC 16): `BuilderVisualSpec`, `BraSVG` with 8 cup types + overlays, `/api/builder-preview/generate` with HuggingFace SDK + Pollinations fallback + Cloudinary caching, 20-color palette, fashion-accurate AI prompts.
- 🔄 Orders are not persisted — `POST /api/orders` returns a timestamp ID without DB writes.
- 🔄 Saved designs are stubbed — GET returns `[]`, POST stores nothing, no `SavedDesign` Prisma model.
- 🔄 Coupons are UI-only — client-side state, no `/api/coupons/validate`, no server enforcement.
- 🔄 Fit calculator has a cm → band conversion bug; full `50H` range not wired in size selectors.
- 🔄 Cart mutations (remove/qty) operate by `id` only, breaking multi-size items.
- 🧪 `npm run lint` — last recorded state: 5 warnings, 0 errors (re-verify before build).
- ⬜ `npm run build` not yet verified against current codebase.

---

## EPIC 1 — PROJECT FOUNDATION

- ✅ FOUND-01 [P0] Define brand identity, color tokens, typography system
- ✅ FOUND-02 [P0] Build full HTML prototype reference
- ✅ FOUND-03 [P0] Write 15-product catalog with editorial copy
- ✅ FOUND-04 [P0] Define TypeScript domain types
- ✅ FOUND-05 [P0] Write `CLAUDE.md` project intelligence file
- ✅ FOUND-06 [P0] Write initial `TASKS.md` work breakdown
- ✅ FOUND-07 [P0] Scaffold Next.js App Router project with TypeScript
- ✅ FOUND-08 [P0] Configure Tailwind CSS v4 theme tokens in `app/globals.css`
- ✅ FOUND-09 [P0] Add `.env.example` and local env structure
- 🔄 FOUND-10 [P0] Configure ESLint; remove remaining lint warnings; add Prettier/lint-staged
- ✅ FOUND-11 [P1] Install core dependencies
- ✅ FOUND-12 [P1] Create project folder structure
- ✅ FOUND-13 [P1] Configure `@/*` path alias
- ✅ FOUND-14 [P1] Write global CSS tokens, fonts, and keyframes
- ✅ FOUND-15 [P1] Create `app/layout.tsx` with fonts, metadata, nav, footer, cart, menu, toasts
- ⬜ FOUND-16 [P1] Replace default `README.md` with Velura setup, DB, admin, and deploy docs
- ✅ FOUND-17 [P1] Reconcile `TASKS.md` and `CLAUDE.md` to Next 16 / Tailwind v4 reality

---

## EPIC 2 — DATA LAYER

### Static Data

- ✅ DATA-01 [P0] Create `types/index.ts`
- ✅ DATA-02 [P0] Create `data/products.ts` 15-product catalog
- ✅ DATA-03 [P1] Create `data/builderOptions.ts` — updated to 20 colours grouped by family
- ✅ DATA-04 [P1] Create `lib/utils.ts`
- ✅ DATA-05 [P1] Create `lib/fitCalculator.ts` baseline calculator
- 🔄 DATA-05B [P0] Fix fit calculator cm → band conversion bug; extend clamp range to support `50H`

### Database

- ✅ DATA-06 [P0] Prisma schema — Product/Image/Review/Order/OrderItem/SavedDesign models complete
- ⬜ DATA-07 [P0] Create/verify Neon PostgreSQL database
- 🔄 DATA-08 [P0] Set and verify all env vars: `DATABASE_URL`, Cloudinary, HF_TOKEN, NextAuth
- ⬜ DATA-09 [P0] Run and verify `prisma generate` + `prisma db push`
- ✅ DATA-10 [P0] Write `prisma/seed.ts`
- ⬜ DATA-11 [P0] Run `prisma db seed` and verify 15 products in DB
- ✅ DATA-12 [P1] Create Prisma singleton in `lib/db.ts`
- ✅ DATA-12B [P1] Add product image metadata: `key`, `isPrimary`, `type`, `position`
- ✅ DATA-23 [P0] Add `Order`, `OrderItem`, and `Address` Prisma models
- ✅ DATA-24 [P1] Add `SavedDesign` Prisma model: `id`, `specHash`, `specJson`, `previewUrl`, `createdAt`

### API Routes

- ✅ DATA-13 [P0] `GET /api/products` with category/support/sort/page/limit
- ✅ DATA-14 [P0] `GET /api/products/[id]`
- ✅ DATA-15 [P0] `POST /api/orders` — Zod validation, server-side totals, DB persistence (dev fallback)
- ✅ DATA-16 [P1] `POST /api/fit-calculator`
- ✅ DATA-17 [P1] `GET /api/saved-designs` — reads from DB (falls back to [] if DB not provisioned)
- ✅ DATA-18 [P1] `POST /api/saved-designs` — Zod validation, DB persistence, deduplication by specHash
- ✅ DATA-19 [P1] `POST /api/coupons/validate` — implemented with Zod validation
- ✅ DATA-20 [P1] Admin product create/update/delete routes
- ✅ DATA-21 [P1] Product image upload/signature/list/delete/primary routes
- ✅ DATA-22 [P0] Add Zod schema validation for all mutating routes (`/api/orders`, `/api/saved-designs`, `/api/fit-calculator`)

---

## EPIC 3 — STATE MANAGEMENT

- ✅ STATE-01 [P0] Create `cartStore`
- ✅ STATE-02 [P0] Persist cart with Zustand `localStorage` middleware
- ✅ STATE-03 [P0] Create `builderStore` with price calculation
- ✅ STATE-04 [P1] Create `uiStore`
- ✅ STATE-05 [P1] Export `useCart`
- ✅ STATE-06 [P1] Export `useBuilder`
- ⬜ STATE-07 [P2] Add cart item count to browser tab title
- ⬜ STATE-08 [P0] Fix cart `remove`/`updateQty` to key on `cartLineId` (`id + size + specHash`) not bare `id`
- ⬜ STATE-09 [P1] Persist builder draft to `localStorage`; restore on return visit

---

## EPIC 4 — UI COMPONENT LIBRARY

- ✅ UI-01 [P0] `Button.tsx`
- ✅ UI-02 [P0] `Badge.tsx`
- ✅ UI-03 [P0] `Skeleton.tsx`
- ✅ UI-04 [P0] `Toast.tsx`
- ⬜ UI-05 [P1] Shared `Modal/Dialog` primitive with focus trap and Escape close
- ✅ UI-06 [P1] `ProgressBar.tsx`
- 🔄 UI-07 [P1] Size selector exists; extract reusable `SizePill` component
- ✅ UI-08 [P1] Reusable `ColorSwatch` component — extracted inside `Step4FabricColor.tsx`

---

## EPIC 5 — LAYOUT COMPONENTS

- ✅ LAYOUT-01 [P0] `Navbar.tsx`
- ✅ LAYOUT-02 [P0] `MobileMenu.tsx`
- ✅ LAYOUT-03 [P0] `Footer.tsx`
- ✅ LAYOUT-04 [P0] `CartDrawer.tsx`
- ✅ LAYOUT-05 [P1] `CartItem.tsx`
- ✅ LAYOUT-06 [P1] `CartSummary.tsx`
- ⬜ LAYOUT-07 [P1] Add drawer focus trap, Escape-to-close, and restored focus on trigger

---

## EPIC 6 — HOME PAGE

- ✅ HOME-01 [P0] `app/page.tsx`
- ✅ HOME-02 [P0] `HeroSection.tsx`
- ✅ HOME-03 [P0] `MarqueeBanner.tsx`
- ✅ HOME-04 [P0] `CategoryGrid.tsx`
- 🔄 HOME-05 [P1] `FeaturedProducts.tsx` — currently static; wire to DB once orders/DB are stable
- ✅ HOME-06 [P1] `ValuesSection.tsx`
- ✅ HOME-07 [P1] `Testimonials.tsx`
- 🔄 HOME-08 [P1] `Newsletter.tsx` — UI done; backend subscriber capture pending
- ⬜ HOME-09 [P2] Full Open Graph / Twitter card metadata for home page

---

## EPIC 7 — SHOP / PRODUCT LISTING

- ✅ SHOP-01 [P0] `app/shop/page.tsx` + `ShopContent.tsx` with `revalidate = 3600`
- 🔄 SHOP-02 [P0] `ProductCard.tsx` — done; quick-add uses invalid size `'M'` (see SHOP-12)
- ✅ SHOP-03 [P0] `ProductGrid.tsx`
- 🔄 SHOP-04 [P0] `FilterSidebar.tsx` — category/support done; size/colour filter pending
- ✅ SHOP-05 [P0] `SortBar.tsx`
- ✅ SHOP-06 [P0] `FilterDrawer.tsx`
- ✅ SHOP-07 [P0] `BuilderPromoBanner.tsx`
- ✅ SHOP-08 [P1] URL-based filtering for category/support/sort/page
- ⬜ SHOP-09 [P1] Wishlist toggle with persistent state
- ✅ SHOP-10 [P1] Pagination
- ⬜ SHOP-11 [P2] Price range slider filter
- ⬜ SHOP-12 [P0] Replace quick-add `size: 'M'` with a valid "Choose Size" drawer or remove quick-add

---

## EPIC 8 — PRODUCT DETAIL PAGE

- ✅ DETAIL-01 [P0] `app/shop/[id]/page.tsx` with `generateStaticParams`
- ✅ DETAIL-02 [P0] `ImageGallery.tsx`
- ✅ DETAIL-03 [P0] `ProductDetail.tsx`
- 🔄 DETAIL-04 [P0] `SizeSelector.tsx` — selection done; range capped at `44DD`, guide missing
- ✅ DETAIL-05 [P0] Add-to-bag with size validation
- ⬜ DETAIL-06 [P1] `ProductMeta.tsx` accordions (care, fit guide, returns)
- ✅ DETAIL-07 [P1] Related products
- ⬜ DETAIL-08 [P2] Recently viewed
- ⬜ DETAIL-09 [P0] Extend size display range through `50H` in selector and parser

---

## EPIC 9 — CUSTOM BRA BUILDER

- ✅ BUILD-01 [P0] `app/builder/page.tsx`
- ✅ BUILD-02 [P0] `CustomBraBuilder.tsx` — reactive `useBuilderStore()` hook; "Continue" button bug fixed
- ✅ BUILD-03 [P0] `StepBar.tsx`
- ✅ BUILD-04 [P0] `Step1Size.tsx`
- ✅ BUILD-05 [P0] `Step2BraType.tsx`
- ✅ BUILD-06 [P0] `Step3Style.tsx`
- ✅ BUILD-07 [P0] `Step4FabricColor.tsx` — 20-colour grouped picker with labelled families
- ✅ BUILD-08 [P0] `Step5Review.tsx`
- ✅ BUILD-09 [P0] `ProductPreview.tsx` — SVG + AI preview toggle, spec-hash change resets AI state
- ✅ BUILD-10 [P0] `BraSVG.tsx` — 8 cup shapes, strap variants, padding/underwire/closure/fabric/bridal overlays, 20-colour map
- ✅ BUILD-11 [P0] Per-step validation gates the "Continue" button
- 🔄 BUILD-12 [P1] Fit calculator sub-flow — sizing math needs cm band fix (see DATA-05B)
- ⬜ BUILD-13 [P1] Save design: write to `localStorage` then `POST /api/saved-designs` with `previewUrl`
- 🔄 BUILD-14 [P1] Add custom item to cart — works, but item ID uses `Date.now()` (unstable)
- ⬜ BUILD-15 [P2] Animate step transitions (fade/slide)
- ⬜ BUILD-16 [P2] Shareable design URL encoding spec params in query string
- ⬜ BUILD-17 [P2] Mobile builder preview — show compact sticky summary below step on narrow screens
- ✅ BUILD-18 [P1] Stabilize custom cart item ID — deterministic `specHash`-based ID in 1_000_000+ range; same spec correctly merges in cart

---

## EPIC 10 — CHECKOUT

- ✅ CHECK-01 [P0] `app/checkout/page.tsx`
- ✅ CHECK-02 [P0] `AddressForm.tsx`
- ✅ CHECK-03 [P0] `PaymentMethods.tsx`
- ✅ CHECK-04 [P0] `OrderSummaryPanel.tsx` — coupon validated server-side; totals synced to parent on every render
- ✅ CHECK-05 [P0] `POST /api/orders` — DB persistence added; Zod validation; server-side totals
- ✅ CHECK-06 [P0] `app/order-confirmed/page.tsx`
- ✅ CHECK-07 [P0] Wire coupon: `OrderSummaryPanel` → `POST /api/coupons/validate` → server-applied discount
- ✅ CHECK-08 [P1] Field-level validation: email regex, 10-digit phone, 6-digit PIN (client hints + server Zod); COD server-enforced
- ✅ CHECK-09 [P1] Empty cart guard
- ⬜ CHECK-10 [P2] Razorpay create order / verify payment / webhook integration
- ⬜ CHECK-11 [P2] Email order confirmation (Resend / SendGrid)
- ✅ CHECK-12 [P0] Recalculate totals server-side before order creation; never trust client prices
- ✅ CHECK-13 [P0] Confirmation page query param — checkout sends `?order=`, confirmation reads `?order=` (already matched)

---

## EPIC 11 — IMAGE SYSTEM

- ⬜ IMG-01 [P0] Create/verify Cloudinary account
- 🔄 IMG-02 [P0] Set/verify Cloudinary env vars
- ✅ IMG-03 [P0] `lib/cloudinary-upload.ts` — upload, delete, signature, URL helper
- ✅ IMG-04 [P0] Configure `next.config.ts` remote image patterns for `res.cloudinary.com`
- 🔄 IMG-05 [P0] Cloudinary folder convention defined; production folder verification pending
- ⬜ IMG-06 [P1] Upload placeholder images for all 15 products (3 per product)
- 🔄 IMG-07 [P1] DB can store Cloudinary URLs; catalog migration pending
- ⬜ IMG-08 [P1] Generate `blurDataURL` for each product image
- ⬜ IMG-09 [P2] Product photography brief (front / back / lifestyle per garment)
- ⬜ IMG-10 [P2] Upload final production photography (45 images minimum)
- ✅ IMG-11 [P1] Admin direct upload to Cloudinary
- ✅ IMG-12 [P1] Admin image manager: list, set primary, delete

---

## EPIC 12 — PERFORMANCE & SEO

- ✅ PERF-01 [P0] Home page is server-rendered (no page-level `use client`)
- ✅ PERF-02 [P0] Shop page exports `revalidate = 3600`
- ✅ PERF-03 [P0] Product pages use `generateStaticParams`
- ✅ PERF-04 [P0] All product images use `next/image`
- 🔄 PERF-05 [P1] `priority` prop used on detail; above-fold hero/shop audit pending
- 🔄 PERF-06 [P1] Metadata exists for root/shop/builder/product; checkout/admin noindex pending
- ⬜ PERF-07 [P1] Product JSON-LD structured data
- ⬜ PERF-08 [P1] `app/sitemap.ts`
- ⬜ PERF-09 [P2] Lighthouse score target: 90+ on all public pages
- ⬜ PERF-10 [P2] `app/robots.ts`
- ✅ PERF-11 [P1] Branded `loading.tsx`, `error.tsx`, and `not-found.tsx` under `app/`

---

## EPIC 13 — QUALITY & TESTING

- ✅ QA-00 [P0] `npm run lint` — 0 errors, 0 warnings
- ✅ QA-13 [P0] `npm run build` — passes clean (32 routes, 0 errors)
- ⬜ QA-01 [P0] E2E manual: all 5 builder steps → add to cart → checkout
- ⬜ QA-02 [P0] Cart: add/remove/qty/persist/multi-size/custom-item behavior
- ⬜ QA-03 [P0] Checkout: validation, server error paths, cart-clear only on success
- ⬜ QA-04 [P0] Mobile layout smoke: 375px, 414px, 768px
- ⬜ QA-05 [P0] Shop filter/sort/pagination combinations
- ⬜ QA-06 [P1] Fit calculator: known cm/in inputs → expected band/cup
- ⬜ QA-07 [P1] Custom bra cart ID stability (no collision with product IDs)
- ⬜ QA-08 [P1] Free shipping threshold toggle at ₹999
- ⬜ QA-09 [P1] Coupon codes: VELURA10, FIRST50
- ⬜ QA-10 [P2] Unit tests for `fitCalculator.ts`
- ⬜ QA-11 [P2] Unit tests for builder pricing in `builderStore`
- ⬜ QA-12 [P1] E2E smoke via Playwright: browse → product → cart → checkout → confirmation
- ⬜ QA-14 [P1] AI preview: test all 20 colours × 3 bra types that AI renders correctly
- ⬜ QA-15 [P2] AI prompt QA matrix: sports/high/wide, lace/light/classic, strapless, wirefree/everyday

---

## EPIC 14 — DEPLOYMENT

- ⬜ DEPLOY-01 [P0] Create/connect Vercel project
- ⬜ DEPLOY-02 [P0] Set all environment variables in Vercel (DB, Cloudinary, HF, NextAuth)
- ⬜ DEPLOY-03 [P0] Set production `DATABASE_URL` (Neon)
- ⬜ DEPLOY-04 [P0] Push Prisma schema to production DB
- ⬜ DEPLOY-05 [P0] Seed production DB with 15 products
- ⬜ DEPLOY-06 [P0] Deploy and smoke-test all public pages
- ⬜ DEPLOY-07 [P1] Configure custom domain (`velura.in`)
- ⬜ DEPLOY-08 [P1] Enable Vercel Analytics and/or Posthog
- ⬜ DEPLOY-09 [P2] Set up preview deployment on PR branches

---

## EPIC 15 — ADMIN & CATALOG OPS

- ✅ ADMIN-01 [P0] NextAuth credential auth
- ✅ ADMIN-02 [P0] Protect `/admin/*` with `proxy.ts`
- ✅ ADMIN-03 [P0] Admin login page
- ✅ ADMIN-04 [P0] Admin product list
- ✅ ADMIN-05 [P0] Product create/edit form
- ✅ ADMIN-06 [P1] Product active/draft toggle route
- ✅ ADMIN-07 [P1] Product delete with Cloudinary cleanup
- ✅ ADMIN-08 [P1] Product image upload panel
- ✅ ADMIN-09 [P1] Product image primary/delete management
- ⬜ ADMIN-10 [P0] Robust form validation and user-friendly API error messages
- ⬜ ADMIN-11 [P1] Admin dashboard: order list, revenue totals (requires order persistence)
- ⬜ ADMIN-12 [P1] Admin order status update route (pending → shipped → delivered)
- ⬜ ADMIN-13 [P2] Role model for non-owner admin access

---

## EPIC 16 — AI CUSTOM BRA VISUALIZER

Goal: deterministic instant SVG preview always-on; optional AI-generated ideal flat-lay product image on demand.

### Core (done)
- ✅ AIPREV-01 [P0] `lib/builderVisualSpec.ts` — `BuilderVisualSpec` normalized view-model, `specToHash()`, `buildAIPrompt()`, `buildPollinationsPrompt()`
- ✅ AIPREV-02 [P0] `BraSVG.tsx` — 8 cup geometries, padding/underwire/closure/lace/silk/bridal overlays, mirror transform for right cup, 20-colour FILL/STROKE maps
- ✅ AIPREV-03 [P0] Deterministic SVG always rendered; AI image is an optional toggle
- ✅ AIPREV-04 [P1] `buildAIPrompt()` — fashion-specific visual language per bra type, strap style, padding depth, fabric texture, closure hardware, colour with exact hex
- ✅ AIPREV-05 [P1] `buildPollinationsPrompt()` — short ≤200 char visual-first prompt for Pollinations FLUX (avoids truncation)
- ✅ AIPREV-07 [P1] `ProductPreview.tsx` — loading skeleton, error/retry, SVG↔AI toggle, disclaimer, spec-hash change resets AI state
- ✅ AIPREV-08 [P1] Cloudinary cache: same spec-hash never generated twice (`velura/custom-previews/{hash}`)
- ✅ AIPREV-10 [P2] Disclaimer: "Preview is representative; final fit and finish may vary."
- ✅ AIPREV-12 [P1] `/api/builder-preview/generate` — rate limit bypassed in `NODE_ENV === 'development'`
- ✅ AIPREV-13 [P1] Provider chain: HuggingFace SDK (`@huggingface/inference`) → Pollinations fallback; Replicate as paid alternative
- ✅ AIPREV-14 [P1] 20-colour palette — Neutrals, Pinks & Reds, Blues & Greens; `Step4FabricColor` grouped UI with section labels

### Pending
- ⬜ AIPREV-06 [P1] Attach `previewUrl` to saved design and custom cart item on generation success
- ⬜ AIPREV-09 [P2] Prompt style presets: editorial flat-lay, ghost mannequin, fabric macro, line-art spec sheet
- ⬜ AIPREV-11 [P2] Visual QA matrix: sports/high/wide · lace/light/classic · strapless/bridal · wirefree/everyday
- ⬜ AIPREV-15 [P2] Show AI provider label in preview UI ("Generated with FLUX" etc.)
- ⬜ AIPREV-16 [P2] Redis-backed rate limiting for production (replace in-memory Map)
- ⬜ AIPREV-17 [P2] "Download preview" button on AI success state
- ⬜ AIPREV-18 [P2] Mobile AI preview — currently hidden on narrow screens; show compact toggle below step

---

## EPIC 17 — FUTURE: ORDER MANAGEMENT

- ⬜ ORD-01 [P1] Order detail page for customers: `/orders/[id]`
- ⬜ ORD-02 [P1] Email order confirmation on `POST /api/orders` success
- ⬜ ORD-03 [P2] Order status tracking page
- ⬜ ORD-04 [P2] Razorpay create/verify/webhook integration
- ⬜ ORD-05 [P2] COD order acknowledgement SMS (Twilio/MSG91)

---

## EPIC 18 — FUTURE: CUSTOMER ACCOUNTS

- ⬜ ACC-01 [P2] Customer registration and login (NextAuth email or OTP)
- ⬜ ACC-02 [P2] Saved addresses
- ⬜ ACC-03 [P2] Order history page
- ⬜ ACC-04 [P2] Wishlist with persistent storage
- ⬜ ACC-05 [P2] Saved designs gallery (requires DATA-24)

---

## EPIC 19 — FUTURE: MARKETING & GROWTH

- ⬜ MKT-01 [P2] Newsletter subscriber capture backend (Mailchimp / Resend list)
- ⬜ MKT-02 [P2] Discount code management in admin
- ⬜ MKT-03 [P2] Referral code system
- ⬜ MKT-04 [P2] Product reviews — submit, moderate, display
- ⬜ MKT-05 [P2] Blog/editorial content pages
- ⬜ MKT-06 [P2] Branded OG image for social sharing

---

## Launch Blockers (P0 summary)

Issues that must be resolved before public launch:

| ID | Issue |
|----|-------|
| DATA-09 | `prisma db push` not run — Order/SavedDesign tables not in DB yet |
| IMG-01 | Cloudinary account must be confirmed active |
| DEPLOY-01–06 | Vercel project, env vars, DB, seed, deploy |

---

## Immediate Next Sprint

Ordered by dependency and impact:

1. **DATA-09** — Run `prisma db push` once `DATABASE_URL` (Neon) is configured; all models are ready.
2. **DATA-11** — Run `prisma db seed` to populate 15 products in the production DB.
3. **DATA-08** — Confirm all env vars are set: `DATABASE_URL`, Cloudinary, `HF_TOKEN`, `NEXTAUTH_SECRET`.
4. **CHECK-08** — Field-level validation in checkout: email, phone, PIN, UPI ID, COD ≤ ₹5000 (server validates COD, add client-side UPI/phone/PIN hints).
5. **BUILD-13** — Save design: write to `localStorage` then `POST /api/saved-designs` with `previewUrl`.
6. **BUILD-18** — Stabilize custom cart item ID — use `specHash + timestamp` instead of bare `Date.now()`.
7. **PERF-11** — Branded `loading.tsx`, `error.tsx`, and `not-found.tsx` under `app/`.
8. **FOUND-16** — Write `README.md` with setup, DB, seed, admin, and deploy instructions.
9. **DEPLOY-01–06** — Vercel project, env vars, DB migration, seed, and smoke test.

---

## Improvement Ideas (not yet tracked)

- Builder: add a "Start from a saved design" entry point once saved designs exist.
- Builder: show a mobile-friendly sticky bottom bar with current price + "Continue" on narrow screens.
- Shop: add a "New Arrivals" filter derived from `createdAt` rather than a hardcoded badge.
- Product detail: show stock/availability indicator once inventory tracking is added.
- AI preview: let users regenerate with a different seed to see color variation.
- AI preview: cache hit rate metric to measure Cloudinary cache effectiveness.
- Accessibility: audit drawer focus trapping and reduced-motion support for marquee/animations.
- Security: add `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` headers in `next.config.ts`.

---

## Notes & Decisions

| Date | Decision | Reason |
|------|----------|--------|
| 2025-05 | Use App Router | SSG/ISR/client interactivity mix |
| 2025-05 | Use Zustand | Small client state, less boilerplate |
| 2025-05 | Use Onyx & Pearl theme | Premium editorial direction |
| 2026-05-25 | Track as Next 16 / Tailwind 4 | Actual installed stack differs from original CLAUDE.md |
| 2026-05-25 | Hybrid visualizer | Instant SVG avoids AI latency; AI preview adds emotional clarity |
| 2026-05-25 | HuggingFace SDK primary, Pollinations fallback | HF SDK handles routing; Pollinations is free zero-config backstop |
| 2026-05-26 | 20-colour palette | Neutral + Pinks/Reds + Blues/Greens covers full lingerie market needs; each colour has matched FILL/STROKE/SVG/API validation |
