@AGENTS.md

# CLAUDE.md — Velura Project Intelligence File
# ─────────────────────────────────────────────
# Read automatically by Claude Code on every session.
# Single source of truth for context, conventions, architecture, and scope.
# Last updated: May 2025 — Onyx & Pearl theme migration complete
# ─────────────────────────────────────────────

---

## 0. WHO YOU ARE IN THIS PROJECT

You are the senior full-stack engineer, product designer, and technical lead for
**Velura** — a premium Indian women's lingerie e-commerce brand.

You have full context of brand, codebase, design system, and business goals.
Do not ask clarifying questions about brand identity, colour system, or component
patterns — all of that is defined below.

When implementing any feature:
1. Read this entire file first
2. Read the relevant source files before writing any code
3. Make surgical changes — never remove working code without being asked
4. Begin every response with: files read + implementation plan
5. Check TypeScript errors mentally before outputting code

---

## 1. BRAND & BUSINESS CONTEXT

**Brand name:** Velura
**Tagline:** "Crafted for the woman who knows."
**Page title:** `VELURA — Crafted for the Woman Who Knows`
**Market:** India — INR pricing, Indian addresses, UPI / COD payments
**Positioning:** Luxury-accessible. Editorial fashion feel at ₹499–₹2,499.
**Audience:** Women 22–45, all body types, XS–4XL / 28AA–50H

### Brand voice

The voice is editorial, not friendly. Think Celine or The Row — not Zara.

- Spare, never verbose
- Confident, never warm-preachy
- Poetic, never flowery
- Written by a woman who already owns the product and has nothing left to prove

**Approved tone:**
```
✅ "Crafted for the woman who knows."
✅ "Disappears under anything. Remembered by your body."
✅ "For the nights that begin at 9 PM."
✅ "Worn once. Remembered forever."
✅ "Invisible, weightless, unforgettable."
✅ "The support you always wanted, without the wire you never liked."
```

**Rejected tone:**
```
❌ "High quality bra with good support"
❌ "Premium lingerie for every woman"
❌ "Feel beautiful in your own skin!"
❌ "Shop our amazing collection today!"
❌ "You deserve to feel comfortable"
```

**CTA copy (canonical):**
```
Primary CTA:  "Explore Collection"   not "Shop Now"
Builder CTA:  "Build Yours"          not "Customise"
Add to cart:  "Add to Bag"           not "Add to Cart"
Checkout:     "Place Order"          not "Buy Now"
Nav builder:  "✦ Custom Bra"
```

---

## 2. ACTIVE THEME — ONYX & PEARL

**Theme:** Onyx & Pearl  
**Activated:** May 2025 (migrated from Rose Bloom)  
**Direction:** Ultra-minimal luxury. Inspired by Celine and The Row.
Zero colour — all texture. The UI disappears; the product carries everything.

### CSS Custom Properties

```css
/* styles/globals.css — :root */
:root {
  --rose:   #B8A898;  /* pearl accent   — section labels, builder CTA, accents  */
  --blush:  #EDE9E4;  /* warm stone     — bg tints, badges, card surfaces       */
  --deep:   #0F0D0B;  /* near black     — text, dark buttons, footer, overlay   */
  --cream:  #F8F6F3;  /* warm white     — page background                      */
  --mauve:  #6B6058;  /* warm grey      — secondary text, meta, form labels     */
  --gold:   #9A8878;  /* muted stone    — star ratings, subtle highlights       */
  --lm:     #D8D4CE;  /* stone border   — dividers, input borders, card edges   */
}
```

### Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Onyx & Pearl ──────────────────────────────
        rose:   '#B8A898',
        blush:  '#EDE9E4',
        deep:   '#0F0D0B',
        cream:  '#F8F6F3',
        mauve:  '#6B6058',
        gold:   '#9A8878',
        lm:     '#D8D4CE',

        // ── Semantic aliases ───────────────────────────
        accent:      '#B8A898',
        surface:     '#EDE9E4',
        foreground:  '#0F0D0B',
        background:  '#F8F6F3',
        muted:       '#6B6058',
        border:      '#D8D4CE',

        // ── Nav (always dark) ──────────────────────────
        'nav-bg':     'rgba(15,13,11,0.96)',
        'nav-border': 'rgba(184,168,152,0.18)',
        'nav-text':   'rgba(237,233,228,0.55)',
        'nav-active': '#EDE9E4',
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      borderRadius: {
        btn:    '3px',
        card:   '4px',
        badge:  '2px',
        input:  '3px',
        drawer: '0px',
        pill:   '50px',   // size selectors only
      },
      boxShadow: {
        card:    '0 2px 12px rgba(15,13,11,0.06)',
        drawer:  '-6px 0 32px rgba(15,13,11,0.18)',
        overlay: '0 4px 20px rgba(15,13,11,0.28)',
        tag:     '0 4px 18px rgba(15,13,11,0.08)',
      },
      letterSpacing: {
        logo:  '0.22em',
        label: '0.14em',
        btn:   '0.12em',
        wide:  '0.18em',
      },
    },
  },
  plugins: [],
}
export default config
```

### Global CSS

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --rose:  #B8A898;
  --blush: #EDE9E4;
  --deep:  #0F0D0B;
  --cream: #F8F6F3;
  --mauve: #6B6058;
  --gold:  #9A8878;
  --lm:    #D8D4CE;
}

body {
  background-color: var(--cream);
  color: var(--deep);
  font-family: 'DM Sans', sans-serif;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}

::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-thumb { background: var(--lm); border-radius: 2px; }
```

---

## 3. DESIGN SYSTEM — TYPOGRAPHY

```
Cormorant Garamond (serif):
  → Headings, product names, hero titles, cart title, section titles
  → Weight 300 (regular headings), 600 (emphasis)
  → letter-spacing: -0.01em on large headings

DM Sans (sans):
  → Everything else: body, labels, buttons, nav, forms, badges, meta
  → Weight 300 (body), 400 (default), 500 (emphasis)
```

**Typography rules:**

| Element | Size | Weight | Tracking | Colour |
|---------|------|--------|----------|--------|
| Hero title | clamp(2.2rem,5vw,4.2rem) | 300 | -0.01em | `deep` |
| Section title | clamp(1.8rem,4vw,2.9rem) | 300 | -0.01em | `deep` |
| Product name | 1.02rem | 500 | 0.01em | `deep` |
| Product price | 1.08rem | 400 | 0.02em | **`deep`** ← not rose |
| Section label | 0.7rem | 400 | 0.15em | `rose` or `mauve` |
| Nav link | 0.72rem | 400 | 0.12em | `rgba(237,233,228,0.55)` |
| Body copy | 0.92rem | 300 | 0 | `mauve` |
| Product story | 0.7rem | 400 italic | 0 | `mauve` |
| Badge | 0.6rem | 600 | 0.1em | `#EDE9E4` |
| Button | 0.8rem | 400 | 0.12em | varies |
| Form label | 0.68rem | 400 | 0.12em | `mauve` |

**Critical editorial rule:** Product prices use `color: var(--deep)` — never `var(--rose)`.
Pearl accent is reserved for section labels, builder CTA, and subtle UI details.
This restraint is what separates luxury from retail.

---

## 4. DESIGN SYSTEM — SHAPE & SPACING

### Border radius — editorial sharp corners

```
Buttons:        3px    (was 50px pill — changed in Onyx & Pearl)
Product cards:  4px    (was 16px)
Form inputs:    3px    (was 12px)
Badges:         2px    (was 50px pill)
Cart drawer:    0px    (full bleed)
Order summary:  4px    (was 22px)
Toast:          3px    (was 50px pill)
Category cards: 4px    (was 18px)
Size selectors: 50px   (intentional exception — UX clarity)
```

### Shadows (near-black only, no warm-rose rgba)

```css
Cards:     0 2px 12px rgba(15,13,11,0.06)
Drawers:  -6px 0 32px rgba(15,13,11,0.18)
Toast:     0 4px 20px rgba(15,13,11,0.30)
Hero tags: 0 4px 18px rgba(15,13,11,0.08)
```

### Overlays

```css
background: rgba(15,13,11,0.55)   /* cart, filter — not warm-rose */
```

### Transitions

```css
Hover:     0.2s ease
Drawers:   0.38s cubic-bezier(0.23,1,0.32,1)
Buttons:   letter-spacing expands on hover (0.12em → 0.16em)
```

---

## 5. DESIGN SYSTEM — COMPONENT RULES

### Navbar — always dark
```css
background: rgba(15,13,11,0.96);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(184,168,152,0.18);
/* Logo text: #EDE9E4, letter-spacing: 0.22em */
/* Nav links inactive: rgba(237,233,228,0.55) */
/* Nav links active: #EDE9E4 */
/* Mobile menu: rgba(15,13,11,0.97) — matches nav */
```

### Logo SVG strokes
```
circle stroke:  #B8A898  (pearl)
path stroke:    #EDE9E4  (warm white)
fill accent:    #B8A898  (pearl, opacity 0.4)
dot:            #B8A898  (pearl)
```

### Buttons — 3 variants, all rectangular
```
btn-dark:    bg=#0F0D0B, color=#EDE9E4 → hover: slightly lighter
btn-outline: bg=transparent, border=1px solid #0F0D0B → hover: fills dark
btn-rose:    bg=#B8A898, color=#0F0D0B, weight 500
```

### Product badges — stone/dark fills, never rose fill
```
Bestseller:   bg=#6B6058, color=#EDE9E4
Premium:      bg=#0F0D0B, color=#EDE9E4
New:          bg=#6B6058, color=#EDE9E4
Sale:         bg=#9A8878, color=#EDE9E4
```

### Cart drawer
```
Item image: border-radius 4px (not 12px)
Qty buttons: border-radius 2px (not 50%)
Shipping bar fill: var(--deep) — not #4caf50 green
Cart price: color=var(--deep) — not rose
```

### Payment options (checkout)
```
Selected: border-color=var(--deep), bg=rgba(15,13,11,0.03)
Radio selected: border-color=var(--deep), bg=var(--deep)
```

### Newsletter section
```
background: linear-gradient(135deg, #0F0D0B 0%, #2A2420 100%)
Input: border-radius 3px, bg rgba(237,233,228,0.08)
No rose/pink anywhere in this section
```

### Builder card selection
```
Hovered: border-color=var(--rose), bg=rgba(184,168,152,0.06)
Selected: border-color=var(--deep), bg=rgba(15,13,11,0.04)
```

### Category cards (home page)
```
border-radius: 4px
Tag pill: border-radius 2px, border: 1px solid rgba(255,255,255,0.3)
Font weight: 300 (not 600)
```

---

## 6. TECH STACK

**Frontend:** Next.js 14 (App Router) · TypeScript strict · Tailwind CSS v3 · Zustand · next/image · Cloudinary · lucide-react · CSS keyframes only

**Backend:** Node.js 18+ · Prisma ORM · PostgreSQL (Neon cloud) · Razorpay · Cloudinary

**Dev:** ESLint · Prettier · Husky · VS Code (ESLint, Prettier, Tailwind IntelliSense, Prisma)

---

## 7. PROJECT STRUCTURE

```
velura/
├── app/
│   ├── layout.tsx                # Fonts, metadata, providers
│   ├── page.tsx                  # Home (SSG)
│   ├── shop/
│   │   ├── page.tsx              # Listing (ISR revalidate:3600)
│   │   └── [id]/page.tsx         # Detail (SSG)
│   ├── builder/page.tsx          # Builder ('use client')
│   ├── checkout/page.tsx         # Checkout ('use client')
│   ├── order-confirmed/page.tsx  # Success
│   └── api/
│       ├── products/route.ts
│       ├── products/[id]/route.ts
│       ├── orders/route.ts
│       ├── fit-calculator/route.ts
│       └── saved-designs/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Always dark nav
│   │   ├── Footer.tsx            # Deep bg, pearl logo strokes
│   │   └── MobileMenu.tsx        # Dark bg matching nav
│   ├── home/
│   │   ├── HeroSection.tsx       # Stone gradient right panel
│   │   ├── MarqueeBanner.tsx     # Deep bg, blush text
│   │   ├── CategoryGrid.tsx      # 4px radius cards, weight 300
│   │   ├── ValuesSection.tsx     # Deep bg, low-opacity pearl borders
│   │   ├── FeaturedProducts.tsx
│   │   ├── Testimonials.tsx
│   │   └── Newsletter.tsx        # Dark charcoal gradient
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx       # Price = deep, not rose
│   │   ├── FilterSidebar.tsx
│   │   ├── SortBar.tsx
│   │   ├── FilterDrawer.tsx
│   │   └── BuilderPromoBanner.tsx
│   ├── product/
│   │   ├── ProductDetail.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── SizeSelector.tsx
│   │   └── ProductMeta.tsx
│   ├── builder/
│   │   ├── CustomBraBuilder.tsx
│   │   ├── StepBar.tsx
│   │   ├── Step1Size.tsx
│   │   ├── Step2BraType.tsx
│   │   ├── Step3Style.tsx
│   │   ├── Step4FabricColor.tsx
│   │   ├── Step5Review.tsx
│   │   ├── ProductPreview.tsx
│   │   └── BraSVG.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx          # 4px img radius, 2px qty btn radius
│   │   └── CartSummary.tsx       # Shipping bar = deep, not green
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentMethods.tsx    # Selected = deep border
│   │   └── OrderSummaryPanel.tsx
│   └── ui/
│       ├── Button.tsx            # 3px radius, letter-spacing motion
│       ├── Badge.tsx             # 2px radius, stone/deep fills
│       ├── Toast.tsx             # 3px radius, deep bg, pearl text
│       ├── Skeleton.tsx          # stone shimmer
│       ├── Modal.tsx
│       └── ProgressBar.tsx
│
├── store/
│   ├── cartStore.ts              # Zustand + persist
│   ├── builderStore.ts           # Builder state + price calc
│   └── uiStore.ts                # cart open, mobile menu, toast
│
├── lib/
│   ├── db.ts                     # Prisma singleton
│   ├── cloudinary.ts
│   ├── razorpay.ts
│   ├── fitCalculator.ts
│   └── utils.ts                  # cn(), formatPrice(), delay()
│
├── types/index.ts
├── data/products.ts              # 15-product catalog
├── prisma/schema.prisma
├── prisma/seed.ts
├── styles/globals.css            # Tokens + keyframes (above)
├── tailwind.config.ts            # Full config (above)
├── .env.local
├── .env.example
├── CLAUDE.md                     ← you are here
└── TASKS.md
```

---

## 8. DATA SHAPES

```typescript
// types/index.ts

export type ProductCategory =
  | 'everyday' | 'pushup' | 'lace' | 'sports'
  | 'seamless' | 'plus'   | 'bridal';

export type BadgeType =
  | 'Bestseller' | 'New' | 'Sale' | 'Premium' | 'Comfort Fit' | null;

export type SupportLevel = 'Light' | 'Medium' | 'High';

export interface Product {
  id:           number;
  name:         string;
  story:        string;       // 1-line editorial mood copy
  sub:          string;       // fabric · feature · size range
  price:        number;       // INR integer
  oldPrice:     number | null;
  emoji:        string;       // placeholder until Cloudinary ready
  badge:        BadgeType;
  cat:          ProductCategory;
  rating:       number;       // 4.3–4.9
  reviews:      number;
  fabric:       string;
  support:      SupportLevel;
  sizes:        string;       // "28A–44DD"
  images:       string[];     // Cloudinary URLs, [0] = primary
  blurDataURL?: string;
}

export interface CartItem {
  id:          number;
  name:        string;
  price:       number;
  qty:         number;
  size:        string;
  emoji:       string;
  images:      string[];
  isCustom?:   boolean;
  customSpec?: BuilderState;
  customGrad?: string;
}

export interface BuilderState {
  sizeMode:   'standard' | 'fit';
  band:       string | null;
  cup:        string | null;
  braType:    string | null;
  strapStyle: string | null;
  padding:    string | null;
  underwire:  string | null;
  closure:    string | null;
  support:    string | null;
  fabric:     string | null;
  color:      string | null;
  fitUnit:    'cm' | 'in';
}

export interface Order {
  id:            string;
  items:         OrderItem[];
  address:       Address;
  paymentMethod: string;
  subtotal:      number;
  shipping:      number;
  total:         number;
  status:        'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt:     string;
}

export interface OrderItem {
  productId:   number | null;
  name:        string;
  qty:         number;
  price:       number;
  size:        string;
  customSpec?: BuilderState;
}

export interface Address {
  firstName: string; lastName: string; email: string; phone: string;
  addressLine: string; city: string; state: string; pinCode: string;
}

export interface FitCalculatorResult {
  band: string; cup: string; size: string; confidence: 'high' | 'medium';
}
```

---

## 9. API CONTRACTS

```
GET  /api/products?cat=&sort=&page=1&limit=12
     → { data: Product[], total: number, page: number }

GET  /api/products/:id
     → { data: Product }

POST /api/orders
     body: { items: OrderItem[], address: Address, paymentMethod: string }
     → { data: { orderId: string, razorpayOrderId?: string } }

POST /api/fit-calculator
     body: { bust: number, underbust: number, unit: 'cm'|'in' }
     → { data: FitCalculatorResult }

GET  /api/saved-designs   → { data: SavedDesign[] }
POST /api/saved-designs   → { data: { id: string } }
```

---

## 10. ENVIRONMENT VARIABLES

```bash
# .env.local — never commit
DATABASE_URL="postgresql://user:pass@localhost:5432/velura"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 11. CODING CONVENTIONS

- Named exports on all components
- `'use client'` only when browser APIs / state / effects are needed
- Server components default — fetch data server-side where possible
- No inline styles — Tailwind classes or CSS variables only
- No `any` TypeScript type
- All async functions have try/catch with typed errors
- Use `cn()` from `lib/utils.ts` for conditional class merging

---

## 12. PRODUCT CATALOG

15 products in `data/products.ts`. All have `story` (editorial 1-liner).

| Category | Count | Range          | Products                          |
|----------|-------|----------------|-----------------------------------|
| everyday | 3     | ₹699–₹899      | FeatherSoft, MorningDew, NudeSense|
| pushup   | 2     | ₹999–₹1,199    | Velvet Plunge, GoldenHour         |
| lace     | 2     | ₹1,399–₹1,599  | Floral Luxe, SilkDream            |
| sports   | 2     | ₹799–₹1,099    | ArmorX, ZenFlow                   |
| seamless | 2     | ₹549–₹949      | CloudLift, BareEase               |
| plus     | 2     | ₹1,049–₹1,149  | CurveLove, SoftCurve              |
| bridal   | 2     | ₹2,199–₹2,499  | Ivory Bloom, MoonlitRose          |

Images: emoji + CSS gradients until Cloudinary photography ready.
Minimum 3 images per product: front / back / lifestyle.

---

## 13. BUSINESS LOGIC

- Free shipping ≥ ₹999, flat ₹79 below
- Shipping bar fill: `var(--deep)` — not green (Onyx & Pearl rule)
- Payments: UPI, Card, Net Banking, COD (under ₹5,000)
- Builder base: ₹999, delivery 7–10 days, exchange on defects only
- Coupons: `VELURA10` (10% off), `FIRST50` (₹50 off)
- Band = underbust rounded up to even, clamped 28–44
- Cup = bust−underbust mapped to AA/A/B/C/D/DD/DDD/G

---

## 14. MIGRATION REFERENCE

HTML prototype: `velura-app.html` (~2,220 lines, Onyx & Pearl applied)

| HTML | Next.js |
|------|---------|
| `showPage('shop')` | `router.push('/shop')` |
| `let cart = []` | `useCartStore()` |
| `CB_sel` | `useBuilderStore()` |
| `api.getProducts()` | `fetch('/api/products')` |
| `api.createOrder()` | `fetch('/api/orders', {POST})` |
| `GRADS[id-1]` | `product.images[0]` |
| `updateCartUI()` | Zustand reactive re-render |
| `renderProducts()` | `<ProductGrid>` + `<ProductCard>` |
| `CB_*` functions | `/components/builder/*.tsx` |
| `localStorage designs` | POST /api/saved-designs |

---

## 15. WHAT NOT TO DO

```
❌ pages/ router              → App Router only
❌ styled-components/emotion  → Tailwind only
❌ Redux                      → Zustand only
❌ Hardcoded hex colours      → use Tailwind tokens (text-deep, bg-blush)
❌ <img> tags                 → always next/image
❌ any TypeScript type        → use unknown and narrow
❌ Business logic in components → put in lib/
❌ .env.local in git          → never commit
❌ Generic copy               → every string must match editorial voice
❌ Rose colour on prices      → prices use deep (#0F0D0B)
❌ Pill/rounded buttons       → 3px border-radius only
❌ Light nav background       → nav is always dark rgba(15,13,11,0.96)
❌ Green shipping bar         → use var(--deep)
❌ Warm-rose rgba shadows     → use near-black rgba(15,13,11,...)
❌ Rose Bloom tokens          → all retired, see §16
```

---

## 16. THEME HISTORY

| Date     | Theme        | Status    | Notes                               |
|----------|--------------|-----------|-------------------------------------|
| Apr 2025 | Rose Bloom   | Retired   | Warm rose — original theme          |
| May 2025 | Onyx & Pearl | **Active**| Editorial luxury — zero colour      |

**Retired Rose Bloom tokens — do not use anywhere:**

```
#C9717A  → rose (retired)       now: #B8A898 (pearl)
#F0D5D8  → blush (retired)      now: #EDE9E4 (warm stone)
#2B1A1C  → deep (retired)       now: #0F0D0B (near black)
#FAF5F0  → cream (retired)      now: #F8F6F3 (warm white)
#8C4F55  → mauve (retired)      now: #6B6058 (warm grey)
#C4975A  → gold (retired)       now: #9A8878 (muted stone)
#E8C8CC  → lm (retired)        now: #D8D4CE (stone border)
```

If you see any of these hex values in the codebase, replace them immediately.

---

## 17. CURRENT STATUS

**Completed:**
- ✅ Brand identity and editorial direction established
- ✅ Full HTML prototype — home, shop, cart, checkout, builder
- ✅ Custom Bra Builder — 5-step flow, fit calculator, SVG preview
- ✅ Product catalog — 15 products with editorial story copy
- ✅ Onyx & Pearl theme — 22 surgical CSS operations, zero stragglers
- ✅ Dark nav, editorial button radius, stone gradients, sharp corners
- ✅ CLAUDE.md updated with complete Onyx & Pearl design system
- ✅ TASKS.md — 120 tasks across 14 epics

**In progress:**
- 🔄 Next.js 14 project scaffolding
- 🔄 TypeScript type definitions
- 🔄 Zustand store setup

**Not started:**
- ⬜ Component migration from HTML
- ⬜ Prisma schema + Neon DB
- ⬜ API routes
- ⬜ Cloudinary setup + image upload
- ⬜ Razorpay integration
- ⬜ Product photography (3 shots × 15 products = 45 images)
- ⬜ SEO metadata + Open Graph
- ⬜ Vercel deployment

---

*Last updated: May 2025 — Onyx & Pearl theme migration*
*Maintainer: Velura Engineering*