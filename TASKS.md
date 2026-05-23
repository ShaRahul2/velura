# TASKS.md — Velura Project Work Items
# ─────────────────────────────────────
# Format:  [STATUS] TASK-ID  Title
# Status:  ✅ Done · 🔄 In Progress · 🧪 Testing · ⬜ Not Started · 🚫 Blocked
# Priority: P0 (launch blocker) · P1 (core feature) · P2 (nice to have)
# ─────────────────────────────────────

---

## EPIC 1 — PROJECT FOUNDATION
*Estimated: 1 day*

- ✅  FOUND-01   Define brand identity, color tokens, typography system
- ✅  FOUND-02   Build full HTML prototype (velura-app.html)
- ✅  FOUND-03   Write product catalog (15 bras with storytelling copy)
- ✅  FOUND-04   Define TypeScript types (Product, CartItem, Order, BuilderState)
- ✅  FOUND-05   Write CLAUDE.md project intelligence file
- ✅  FOUND-06   Write TASKS.md work breakdown (this file)
- ⬜  FOUND-07   [P0] Scaffold Next.js 14 project with TypeScript + Tailwind
- ⬜  FOUND-08   [P0] Configure tailwind.config.ts with Velura brand tokens
- ⬜  FOUND-09   [P0] Set up .env.local and .env.example
- ⬜  FOUND-10   [P0] Set up ESLint + Prettier config
- ⬜  FOUND-11   [P1] Install and configure all npm dependencies
- ⬜  FOUND-12   [P1] Create project folder structure (all directories)
- ⬜  FOUND-13   [P1] Set up path aliases in tsconfig.json (@/*)
- ⬜  FOUND-14   [P1] Write global CSS (Tailwind base + brand keyframes + fonts)
- ⬜  FOUND-15   [P1] Create app/layout.tsx (fonts, metadata, providers wrapper)

### FOUND-07 Setup Command
```bash
npx create-next-app@latest velura \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias "@/*"
cd velura
npm install zustand @prisma/client prisma \
  cloudinary next-cloudinary \
  razorpay clsx tailwind-merge lucide-react
npm install -D @types/node husky lint-staged
```

---

## EPIC 2 — DATA LAYER
*Estimated: 1–2 days*

### 2A — Static Data (immediate, no DB needed)
- ✅  DATA-01  [P0] Create types/index.ts with all interfaces from CLAUDE.md §5
- ✅  DATA-02  [P0] Create data/products.ts with 15-product catalog array
- ✅  DATA-03  [P1] Create data/builderOptions.ts (CB_BRA_TYPES, CB_STRAPS, etc.)
- ✅  DATA-04  [P1] Create lib/utils.ts (cn, formatPrice, delay helpers)
- ✅  DATA-05  [P1] Create lib/fitCalculator.ts (band/cup calculation logic)

### 2B — Database
- ⬜  DATA-06  [P0] Write prisma/schema.prisma (Product, Order, OrderItem, SavedDesign)
- ⬜  DATA-07  [P0] Create Neon PostgreSQL database (or local pg)
- ⬜  DATA-08  [P0] Set DATABASE_URL in .env.local
- ⬜  DATA-09  [P0] Run `npx prisma generate` and `npx prisma db push`
- ⬜  DATA-10  [P0] Write prisma/seed.ts from data/products.ts
- ⬜  DATA-11  [P0] Run `npx prisma db seed` — verify 15 products in DB
- ⬜  DATA-12  [P1] Create lib/db.ts (Prisma client singleton, no duplicate connections)

### 2C — API Routes
- ⬜  DATA-13  [P0] GET  /api/products (filter by cat, sort, paginate)
- ⬜  DATA-14  [P0] GET  /api/products/[id]
- ⬜  DATA-15  [P0] POST /api/orders
- ⬜  DATA-16  [P1] POST /api/fit-calculator
- ⬜  DATA-17  [P1] GET  /api/saved-designs
- ⬜  DATA-18  [P1] POST /api/saved-designs
- ⬜  DATA-19  [P2] POST /api/coupons/validate (replace hardcoded codes)

---

## EPIC 3 — STATE MANAGEMENT
*Estimated: 0.5 days*

- ✅  STATE-01  [P0] Create store/cartStore.ts (add, remove, updateQty, clear, total, count)
- ✅  STATE-02  [P0] Add Zustand persist middleware to cartStore (localStorage)
- ✅  STATE-03  [P0] Create store/builderStore.ts (BuilderState + price calculator)
- ✅  STATE-04  [P1] Create store/uiStore.ts (cartOpen, mobileMenuOpen, toast queue)
- ✅  STATE-05  [P1] Write useCart() convenience hook
- ✅  STATE-06  [P1] Write useBuilder() convenience hook
- ⬜  STATE-07  [P2] Add cart item count to browser tab title

---

## EPIC 4 — UI COMPONENT LIBRARY
*Estimated: 1 day*

These are the base building blocks. Build these before any page components.

- ⬜  UI-01  [P0] Button.tsx (variants: dark, rose, outline; sizes: sm, md, lg)
- ⬜  UI-02  [P0] Badge.tsx (Bestseller, New, Sale, Premium, Comfort Fit with colors)
- ⬜  UI-03  [P0] Skeleton.tsx (product card skeleton, text skeleton)
- ⬜  UI-04  [P0] Toast.tsx (slide-up, auto-dismiss, HTML content support)
- ⬜  UI-05  [P1] Modal.tsx (overlay + drawer pattern)
- ⬜  UI-06  [P1] ProgressBar.tsx (shipping progress, builder step progress)
- ⬜  UI-07  [P1] SizePill.tsx (toggle active state)
- ⬜  UI-08  [P1] ColorSwatch.tsx (round dot with active ring)

---

## EPIC 5 — LAYOUT COMPONENTS
*Estimated: 0.5 days*

- ⬜  LAYOUT-01  [P0] Navbar.tsx (logo, nav links, cart icon with badge, hamburger)
- ⬜  LAYOUT-02  [P0] MobileMenu.tsx (slide-down panel, all nav links)
- ⬜  LAYOUT-03  [P0] Footer.tsx (4-column grid, social links, copyright)
- ⬜  LAYOUT-04  [P0] CartDrawer.tsx (right slide-in, ship progress, totals, CTAs)
- ⬜  LAYOUT-05  [P1] CartItem.tsx (image, name, qty controls, remove)
- ⬜  LAYOUT-06  [P1] CartSummary.tsx (subtotal, savings, shipping, total row)

---

## EPIC 6 — HOME PAGE
*Estimated: 1 day*

- ⬜  HOME-01  [P0] app/page.tsx (SSG, compose all sections)
- ⬜  HOME-02  [P0] HeroSection.tsx (2-col layout, SVG illustration, stats, CTAs)
- ⬜  HOME-03  [P0] MarqueeBanner.tsx (auto-scrolling trust strip, dark bg)
- ⬜  HOME-04  [P0] CategoryGrid.tsx (5-card bento grid, links to /shop?cat=)
- ⬜  HOME-05  [P1] FeaturedProducts.tsx (4 bestsellers, fetch from API)
- ⬜  HOME-06  [P1] ValuesSection.tsx (4 brand promises, dark bg)
- ⬜  HOME-07  [P1] Testimonials.tsx (3 review cards)
- ⬜  HOME-08  [P1] Newsletter.tsx (email capture form, gradient bg)
- ⬜  HOME-09  [P2] Add Open Graph meta tags to layout.tsx

---

## EPIC 7 — SHOP / PRODUCT LISTING
*Estimated: 1.5 days*

- ⬜  SHOP-01  [P0] app/shop/page.tsx (ISR, revalidate: 3600, fetch from API)
- ⬜  SHOP-02  [P0] ProductCard.tsx (image, badge, wish, quick-add, name, story, price, rating)
- ⬜  SHOP-03  [P0] ProductGrid.tsx (responsive grid, skeleton loading, empty state)
- ⬜  SHOP-04  [P0] FilterSidebar.tsx (category, size, color — desktop sticky)
- ⬜  SHOP-05  [P0] SortBar.tsx (sort dropdown, view toggle 2/3 col, item count)
- ⬜  SHOP-06  [P0] FilterDrawer.tsx (mobile slide-in filter panel)
- ⬜  SHOP-07  [P0] BuilderPromoBanner.tsx (dark promo strip → /builder)
- ⬜  SHOP-08  [P1] Implement URL-based filtering (?cat=lace&sort=rating)
- ⬜  SHOP-09  [P1] Add wishlist toggle with persistent state
- ⬜  SHOP-10  [P1] Pagination or infinite scroll (page=1&limit=12)
- ⬜  SHOP-11  [P2] Price range slider filter

---

## EPIC 8 — PRODUCT DETAIL PAGE
*Estimated: 1 day*

- ⬜  DETAIL-01  [P0] app/shop/[id]/page.tsx (SSG with generateStaticParams)
- ⬜  DETAIL-02  [P0] ImageGallery.tsx (thumbnail strip, main image, zoom on hover)
- ⬜  DETAIL-03  [P0] ProductDetail.tsx (name, story, price, badge, fabric, support)
- ⬜  DETAIL-04  [P0] SizeSelector.tsx (chip grid, selected state, size guide link)
- ⬜  DETAIL-05  [P0] Add to Cart button with size validation
- ⬜  DETAIL-06  [P1] ProductMeta.tsx (fabric, support, sizes accordion)
- ⬜  DETAIL-07  [P1] RelatedProducts.tsx (same category, exclude current)
- ⬜  DETAIL-08  [P2] Recently viewed (localStorage)

---

## EPIC 9 — CUSTOM BRA BUILDER
*Estimated: 2 days — most complex feature*

- ⬜  BUILD-01  [P0] app/builder/page.tsx ('use client', step orchestration)
- ⬜  BUILD-02  [P0] CustomBraBuilder.tsx (state container, step router)
- ⬜  BUILD-03  [P0] StepBar.tsx (5 steps, active/done/locked states, click to nav)
- ⬜  BUILD-04  [P0] Step1Size.tsx (SizeSelector chip grid + FitCalculator tab)
- ⬜  BUILD-05  [P0] Step2BraType.tsx (8 type cards with icons and pricing)
- ⬜  BUILD-06  [P0] Step3Style.tsx (straps, padding, underwire, closure, support)
- ⬜  BUILD-07  [P0] Step4FabricColor.tsx (5 fabric cards + 10 color swatches)
- ⬜  BUILD-08  [P0] Step5Review.tsx (summary grid, breakdown, disclaimer, CTAs)
- ⬜  BUILD-09  [P0] ProductPreview.tsx (sticky panel, live price, trust strip)
- ⬜  BUILD-10  [P0] BraSVG.tsx (dynamic SVG: color fill + strap shape variants)
- ⬜  BUILD-11  [P0] Per-step validation (cannot advance without required selections)
- ⬜  BUILD-12  [P1] FitCalculator sub-component (bust/underbust → size suggestion)
- ⬜  BUILD-13  [P1] Save design to localStorage then POST /api/saved-designs
- ⬜  BUILD-14  [P1] Add custom item to cart (compatible with CartStore)
- ⬜  BUILD-15  [P2] Animate step transitions (fadeUp between steps)
- ⬜  BUILD-16  [P2] Share/copy design URL

---

## EPIC 10 — CHECKOUT
*Estimated: 1 day*

- ⬜  CHECK-01  [P0] app/checkout/page.tsx ('use client')
- ⬜  CHECK-02  [P0] AddressForm.tsx (Indian address fields, state dropdown, validation)
- ⬜  CHECK-03  [P0] PaymentMethods.tsx (card, UPI, net banking, COD radio group)
- ⬜  CHECK-04  [P0] OrderSummaryPanel.tsx (items, coupon input, totals, place order)
- ⬜  CHECK-05  [P0] POST /api/orders — create order in DB
- ⬜  CHECK-06  [P0] app/order-confirmed/page.tsx (success screen, order number)
- ⬜  CHECK-07  [P1] Coupon code validation (VELURA10, FIRST50)
- ⬜  CHECK-08  [P1] Form validation with error states (all required fields)
- ⬜  CHECK-09  [P1] Empty cart guard (redirect to /shop if cart empty)
- ⬜  CHECK-10  [P2] Razorpay payment gateway integration (lib/razorpay.ts)
- ⬜  CHECK-11  [P2] Email order confirmation (Resend or Nodemailer)

---

## EPIC 11 — IMAGE SYSTEM
*Estimated: 0.5–1 day setup + ongoing as photos arrive*

- ⬜  IMG-01  [P0] Create Cloudinary account (free tier: 25GB)
- ⬜  IMG-02  [P0] Set CLOUDINARY_* env vars
- ⬜  IMG-03  [P0] Create lib/cloudinary.ts (upload + transform URL helpers)
- ⬜  IMG-04  [P0] Configure next.config.ts to allow res.cloudinary.com images
- ⬜  IMG-05  [P0] Create Cloudinary folder: velura/products/
- ⬜  IMG-06  [P1] Upload placeholder product images (3 per product = 45 images)
- ⬜  IMG-07  [P1] Update products DB with Cloudinary URLs
- ⬜  IMG-08  [P1] Generate blurDataURL for each product (base64 tiny placeholder)
- ⬜  IMG-09  [P2] Product photography brief (angles: front, back, on-body lifestyle)
- ⬜  IMG-10  [P2] Upload production photography when ready

### next.config.ts image domains
```ts
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'res.cloudinary.com',
  }]
}
```

---

## EPIC 12 — PERFORMANCE & SEO
*Estimated: 1 day*

- ⬜  PERF-01  [P0] Verify home page is SSG (no 'use client' at page level)
- ⬜  PERF-02  [P0] Verify shop page is ISR (revalidate: 3600)
- ⬜  PERF-03  [P0] Verify product pages are SSG (generateStaticParams)
- ⬜  PERF-04  [P0] All product images use next/image with correct sizes prop
- ⬜  PERF-05  [P1] Above-fold images have priority={true}
- ⬜  PERF-06  [P1] Add metadata exports to all page.tsx files (title, description)
- ⬜  PERF-07  [P1] Add JSON-LD structured data to product detail pages
- ⬜  PERF-08  [P1] Generate sitemap.xml
- ⬜  PERF-09  [P2] Run Lighthouse — target 90+ on all metrics
- ⬜  PERF-10  [P2] Add robots.txt

---

## EPIC 13 — QUALITY & TESTING
*Estimated: 1 day*

- ⬜  QA-01  [P0] Test all 5 builder steps end-to-end
- ⬜  QA-02  [P0] Test cart: add, remove, qty change, persist after refresh
- ⬜  QA-03  [P0] Test checkout form validation (empty, invalid email, short PIN)
- ⬜  QA-04  [P0] Test mobile layout on 375px, 414px, 768px viewports
- ⬜  QA-05  [P0] Test all filter combinations in shop page
- ⬜  QA-06  [P1] Test fit calculator with known size inputs
- ⬜  QA-07  [P1] Test custom bra add-to-cart (ID conflict, cart render)
- ⬜  QA-08  [P1] Test free shipping threshold (₹998 vs ₹999 vs ₹1000)
- ⬜  QA-09  [P1] Test coupon codes (valid, invalid, empty)
- ⬜  QA-10  [P2] Write unit tests for fitCalculator.ts (jest)
- ⬜  QA-11  [P2] Write unit tests for price calculation in builderStore.ts

---

## EPIC 14 — DEPLOYMENT
*Estimated: 0.5 days*

- ⬜  DEPLOY-01  [P0] Create Vercel account, connect GitHub repo
- ⬜  DEPLOY-02  [P0] Set all environment variables in Vercel dashboard
- ⬜  DEPLOY-03  [P0] Set DATABASE_URL to Neon production connection string
- ⬜  DEPLOY-04  [P0] Run `npx prisma db push` on production DB
- ⬜  DEPLOY-05  [P0] Run `npx prisma db seed` on production DB
- ⬜  DEPLOY-06  [P0] Deploy to Vercel — verify all pages load
- ⬜  DEPLOY-07  [P1] Configure custom domain (velura.in or similar)
- ⬜  DEPLOY-08  [P1] Enable Vercel Analytics
- ⬜  DEPLOY-09  [P2] Set up staging environment (preview deployments on PRs)

---

## DEPENDENCY MAP

```
FOUND-07 (scaffold)
  └─► FOUND-08, 09, 10, 11, 12, 13, 14, 15
        └─► DATA-01 (types)
              └─► DATA-02 (products.ts)
                    └─► DATA-06 (schema)
                          └─► DATA-07, 08, 09, 10, 11, 12
                                └─► DATA-13..19 (API routes)

FOUND-07
  └─► STATE-01..07 (stores)
        └─► UI-01..08 (base components)
              └─► LAYOUT-01..06 (layout components)
                    └─► HOME-01..09
                    └─► SHOP-01..11
                    └─► DETAIL-01..08
                    └─► BUILD-01..16
                    └─► CHECK-01..11

IMG-01..05 (Cloudinary setup)
  └─► IMG-06..10 (image upload)
        └─► DETAIL-02 (ImageGallery)

SHOP-01 + CHECK-05 (API calls)
  └─► DATA-13..15 (API routes must exist first)

DEPLOY-01..06
  └─► All P0 tasks must be done first
```

---

## SPRINT PLAN (2-Week Launch Sprint)

### Week 1 — Foundation + Core Pages

| Day | Focus                         | Tasks                                  |
|-----|-------------------------------|----------------------------------------|
| 1   | Project setup                 | FOUND-07 to FOUND-15                   |
| 2   | Data layer                    | DATA-01 to DATA-12                     |
| 3   | API routes + stores           | DATA-13 to DATA-19, STATE-01 to 07     |
| 4   | UI components                 | UI-01 to 08, LAYOUT-01 to 06           |
| 5   | Home page                     | HOME-01 to 09                          |

### Week 2 — Features + Polish + Deploy

| Day | Focus                         | Tasks                                  |
|-----|-------------------------------|----------------------------------------|
| 6   | Shop + Product listing        | SHOP-01 to 11                          |
| 7   | Product detail page           | DETAIL-01 to 08                        |
| 8   | Custom Bra Builder            | BUILD-01 to 14                         |
| 9   | Checkout + Order flow         | CHECK-01 to 09                         |
| 10  | Images + SEO + QA + Deploy    | IMG-01 to 08, PERF-01 to 08, DEPLOY-01 to 07 |

---

## NOTES & DECISIONS LOG

| Date     | Decision                                              | Reason                              |
|----------|-------------------------------------------------------|-------------------------------------|
| May 2025 | Use Next.js App Router over Pages Router              | SSG/ISR/CSR mix needed              |
| May 2025 | Use Zustand over Redux                                | Simpler, no boilerplate             |
| May 2025 | Use Neon for Postgres (not local)                     | Zero local setup, same in prod      |
| May 2025 | Emoji + GRADS as image placeholder until photography  | Unblock dev, swap later             |
| May 2025 | All CB_ builder functions → separate component files  | Maintainability as codebase grows   |
| May 2025 | No external animation library                         | CSS keyframes sufficient, no bloat  |
| May 2025 | Razorpay P2 (not P0)                                  | COD works for MVP, Razorpay later   |

---

*Last updated: May 2025*
*Total tasks: 120+*
*P0 (launch blockers): ~60*
*P1 (core features): ~45*
*P2 (nice to have): ~20*
