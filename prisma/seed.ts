import { PrismaClient, BadgeType, ProductCategory, SupportLevel, ImageType } from '@prisma/client'
import { products as STATIC } from '../data/products'

const db = new PrismaClient()

// ── Category seed data ────────────────────────────────────────────────────────

const CATEGORIES: {
  slug: ProductCategory
  label: string
  description: string
  sortOrder: number
}[] = [
  { slug: 'everyday', label: 'Everyday',  description: 'All-day comfort, refined.',          sortOrder: 1 },
  { slug: 'pushup',   label: 'Push-Up',   description: 'Shape and lift for any occasion.',    sortOrder: 2 },
  { slug: 'lace',     label: 'Lace',      description: 'Delicate, feminine, effortless.',     sortOrder: 3 },
  { slug: 'sports',   label: 'Sports',    description: 'Built for movement. Made for you.',   sortOrder: 4 },
  { slug: 'seamless', label: 'Seamless',  description: 'Invisible under anything.',           sortOrder: 5 },
  { slug: 'plus',     label: 'Plus',      description: 'Designed for fuller curves.',         sortOrder: 6 },
  { slug: 'bridal',   label: 'Bridal',    description: 'For the morning of.',                 sortOrder: 7 },
]

// ── Badge mapping ─────────────────────────────────────────────────────────────

function mapBadge(badge: string | null): BadgeType | null {
  if (badge === null) return null
  if (badge === 'Comfort Fit') return BadgeType.ComfortFit
  return badge as BadgeType
}

// ── Image type by position ────────────────────────────────────────────────────

const IMAGE_TYPES: ImageType[] = [ImageType.front, ImageType.back, ImageType.lifestyle]

// ── Sample review data ────────────────────────────────────────────────────────

const REVIEW_AUTHORS = [
  'Priya M.', 'Shreya K.', 'Ananya R.', 'Divya S.',
  'Meera P.', 'Kavya T.',  'Riya J.',   'Tanvi B.',
  'Pooja L.', 'Neha V.',   'Isha R.',   'Swati G.',
]

const REVIEW_BODIES: (string | null)[] = [
  'Exactly what I was looking for. Fits perfectly and the fabric is incredibly soft.',
  'Wore this all day and forgot I had it on. That says everything.',
  'Far better quality than I expected at this price. Will be buying more.',
  'Finally a bra that actually fits and still looks beautiful under anything.',
  'My go-to for long workdays. Comfortable without sacrificing support.',
  'The fabric is so soft against the skin — no irritation after 12 hours.',
  'Bought in two colours now. The fit is consistently perfect.',
  'Sizing is accurate. Exactly as described — I ordered my usual size and it fits.',
  null,
  null,
]

function generateReviews(productId: number, avgRating: number) {
  // 4 reviews per product, ratings distributed to match the aggregate avg
  const ratings = [
    Math.min(5, Math.round(avgRating)),
    Math.min(5, Math.round(avgRating)),
    Math.max(1, Math.round(avgRating - 0.5)),
    Math.min(5, Math.round(avgRating + 0.3)),
  ]
  return ratings.map((rating, i) => ({
    productId,
    rating,
    body:     REVIEW_BODIES[(productId * 2 + i) % REVIEW_BODIES.length],
    author:   REVIEW_AUTHORS[(productId + i) % REVIEW_AUTHORS.length],
    verified: i < 3,
  }))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Resetting tables...')
  await db.review.deleteMany()
  await db.productImage.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()

  // 1. Categories
  console.log('Seeding categories...')
  await db.category.createMany({ data: CATEGORIES })

  const categoryMap = new Map(
    (await db.category.findMany()).map((c) => [c.slug, c.id])
  )

  // 2. Products
  console.log('Seeding products...')
  await db.product.createMany({
    data: STATIC.map((p) => ({
      id:          p.id,
      name:        p.name,
      story:       p.story,
      sub:         p.sub,
      price:       p.price,
      oldPrice:    p.oldPrice ?? null,
      emoji:       p.emoji,
      badge:       mapBadge(p.badge),
      categoryId:  categoryMap.get(p.cat as ProductCategory)!,
      rating:      p.rating,
      reviewCount: p.reviews,
      fabric:      p.fabric,
      support:     p.support as SupportLevel,
      sizes:       p.sizes,
      isActive:    true,
    })),
    skipDuplicates: true,
  })

  // 3. Product images (3 per product → separate rows)
  console.log('Seeding product images...')
  const imageRows = STATIC.flatMap((p) =>
    p.images.map((url, i) => ({
      productId: p.id,
      url,
      alt:       `${p.name} — ${['front view', 'back view', 'lifestyle'][i] ?? 'detail'}`,
      position:  i,
      type:      IMAGE_TYPES[i] ?? ImageType.detail,
      isPrimary: i === 0,
    }))
  )
  await db.productImage.createMany({ data: imageRows })

  // 4. Sample reviews
  console.log('Seeding reviews...')
  const reviewRows = STATIC.flatMap((p) => generateReviews(p.id, p.rating))
  await db.review.createMany({ data: reviewRows })

  // Reset PG sequences
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), MAX(id)) FROM "Product";`
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), MAX(id)) FROM "Category";`
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"ProductImage"', 'id'), MAX(id)) FROM "ProductImage";`
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"Review"', 'id'), MAX(id)) FROM "Review";`

  // Summary
  const [cats, prods, imgs, revs] = await db.$transaction([
    db.category.count(),
    db.product.count(),
    db.productImage.count(),
    db.review.count(),
  ])
  console.log(`✓ ${cats} categories · ${prods} products · ${imgs} images · ${revs} reviews`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
