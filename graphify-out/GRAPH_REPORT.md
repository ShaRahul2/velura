# Graph Report - /Users/rahulsharma/Movies/javaProjects/velura  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 505 nodes · 899 edges · 26 communities (19 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b942634`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- utils.ts
- formatPrice
- dependencies
- index.ts
- lib/products.ts
- devDependencies
- generate/route.ts
- compilerOptions
- edit/page.tsx
- db.ts
- orders/route.ts
- ShopContent.tsx
- app/page.tsx
- fitCalculator.ts
- BraSVG.tsx
- login/page.tsx
- admin/layout.tsx
- error.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `formatPrice()` - 28 edges
2. `useUiStore` - 17 edges
3. `compilerOptions` - 16 edges
4. `Product` - 16 edges
5. `useBuilderStore` - 15 edges
6. `useCartStore` - 15 edges
7. `cn()` - 13 edges
8. `POST()` - 11 edges
9. `CB_COLOR_OPTIONS` - 11 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getProductById()`  [EXTRACTED]
  app/api/products/[id]/route.ts → lib/products.ts
- `DELETE()` --indirect_call--> `destroyCloudinaryAsset()`  [INFERRED]
  app/api/products/[id]/route.ts → lib/cloudinary-upload.ts
- `Props` --references--> `Product`  [EXTRACTED]
  components/admin/ProductForm.tsx → types/index.ts
- `Props` --references--> `CartItem`  [EXTRACTED]
  components/checkout/OrderSummaryPanel.tsx → types/index.ts
- `ProductDetailProps` --references--> `Product`  [EXTRACTED]
  components/product/ProductDetail.tsx → types/index.ts

## Import Cycles
- None detected.

## Communities (26 total, 7 thin omitted)

### Community 0 - "utils.ts"
Cohesion: 0.05
Nodes (47): CheckoutPage(), EMPTY_ADDRESS, cormorant, dmSans, metadata, CartDrawer(), CartItem(), CartItemProps (+39 more)

### Community 1 - "formatPrice"
Cohesion: 0.08
Nodes (45): metadata, canProceed(), CustomBraBuilder(), AIState, optionLabel(), ProductPreview(), ProductPreviewProps, STEP_LABELS (+37 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (43): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, cloudinary, clsx, @huggingface/inference, lucide-react, next, next-auth (+35 more)

### Community 3 - "index.ts"
Cohesion: 0.08
Nodes (30): generateMetadata(), generateStaticParams(), getCachedProduct, PageProps, ProductPage(), FEATURED_IDS, CATEGORY_GRADIENTS, HeroSection() (+22 more)

### Community 4 - "lib/products.ts"
Cohesion: 0.08
Nodes (32): AdminProductRow(), AdminProductsPage(), dynamic, Context, DELETE(), GET(), PUT(), GET() (+24 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (36): dotenv-cli, eslint, eslint-config-next, devDependencies, dotenv-cli, eslint, eslint-config-next, tailwindcss (+28 more)

### Community 6 - "generate/route.ts"
Cohesion: 0.11
Nodes (27): checkRateLimit(), generateWithHuggingFace(), generateWithPollinations(), generateWithReplicate(), ImageData, maxDuration, POST(), Provider (+19 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "edit/page.tsx"
Cohesion: 0.09
Nodes (20): AdminImage, EditImagePanel(), Props, dynamic, EditProductPage(), AdminImage, ImageManager(), Props (+12 more)

### Community 9 - "db.ts"
Cohesion: 0.13
Nodes (9): DELETE(), POST(), SaveSchema, { handlers, auth, signIn, signOut }, destroyCloudinaryAsset(), db, globalForPrisma, config (+1 more)

### Community 10 - "orders/route.ts"
Cohesion: 0.19
Nodes (16): POST(), Schema, AddressSchema, getProductPriceMap(), OrderItemSchema, OrderSchema, POST(), OrderSummaryPanel() (+8 more)

### Community 11 - "ShopContent.tsx"
Cohesion: 0.13
Nodes (14): BuilderPromoBanner(), CATEGORIES, FilterDrawer(), FilterDrawerProps, SUPPORT, CATEGORIES, FilterSidebar(), SUPPORT (+6 more)

### Community 12 - "app/page.tsx"
Cohesion: 0.15
Nodes (9): CATEGORIES, CategoryGrid(), ITEMS, MarqueeBanner(), Newsletter(), REVIEWS, Testimonials(), VALUES (+1 more)

### Community 13 - "fitCalculator.ts"
Cohesion: 0.27
Nodes (11): POST(), BAND_SIZES, calculateFit(), CUP_THRESHOLDS, getConfidence(), getCup(), normalizeBand(), toCm() (+3 more)

### Community 14 - "BraSVG.tsx"
Cohesion: 0.28
Nodes (8): BraSVG(), BraSVGProps, CUP_PARAMS, CupParams, FILL_MAP, leftCupPath(), STROKE_MAP, BuilderVisualSpec

## Knowledge Gaps
- **176 isolated node(s):** `NAV`, `dynamic`, `AdminImage`, `Props`, `dynamic` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **What connects `NAV`, `dynamic`, `AdminImage` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05432595573440644 - nodes in this community are weakly interconnected._
- **Should `formatPrice` be split into smaller, more focused modules?**
  _Cohesion score 0.08248587570621468 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04756871035940803 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08048780487804878 - nodes in this community are weakly interconnected._
- **Should `lib/products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08076923076923077 - nodes in this community are weakly interconnected._