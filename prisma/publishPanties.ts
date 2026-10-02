/**
 * Idempotent publish for the panties collection.
 * Safe on a live catalogue: it does not wipe bras, orders, or reviews.
 *
 *   npx prisma generate
 *   npm run db:push
 *   npx dotenv -e .env.local -- tsx prisma/publishPanties.ts
 */
import { PrismaClient, BadgeType, SupportLevel, ImageType, ProductCategory } from '@prisma/client'
import { products as STATIC } from '../data/products'
import { describeProductImage, shotKindFromIndex } from '../lib/productDescribe'

const db = new PrismaClient()
const PANTY = STATIC.filter((product) => product.cat === 'panties')
const IMAGE_TYPES: ImageType[] = [ImageType.front, ImageType.back, ImageType.lifestyle]

function mapBadge(badge: string | null): BadgeType | null {
  if (badge === null) return null
  if (badge === 'Comfort Fit') return BadgeType.ComfortFit
  return badge as BadgeType
}

async function main() {
  if (!PANTY.length) throw new Error('No panties in the static catalogue.')

  const category = await db.category.upsert({
    where: { slug: ProductCategory.panties },
    update: {
      label: 'Panties',
      description: 'Cut close. Forgotten by noon.',
      sortOrder: 8,
    },
    create: {
      slug: ProductCategory.panties,
      label: 'Panties',
      description: 'Cut close. Forgotten by noon.',
      sortOrder: 8,
    },
  })

  for (const product of PANTY) {
    const data = {
      name: product.name,
      story: product.story,
      sub: product.sub,
      price: product.price,
      oldPrice: product.oldPrice,
      emoji: product.emoji,
      badge: mapBadge(product.badge),
      categoryId: category.id,
      rating: product.rating,
      reviewCount: product.reviews,
      fabric: product.fabric,
      support: product.support as SupportLevel,
      sizes: product.sizes,
      isActive: true,
    }

    const existing = await db.product.findFirst({
      where: { name: { equals: product.name, mode: 'insensitive' } },
      select: { id: true },
    })

    const row = existing
      ? await db.product.update({ where: { id: existing.id }, data })
      : await db.product.create({ data: { id: product.id, ...data } })

    await db.productImage.deleteMany({ where: { productId: row.id } })
    await db.productImage.createMany({
      data: product.images.map((url, index) => ({
        productId: row.id,
        url,
        alt: describeProductImage(product, { shot: shotKindFromIndex(index) }),
        position: index,
        type: IMAGE_TYPES[index] ?? ImageType.detail,
        isPrimary: index === 0,
      })),
    })
    console.log(`✓ ${product.name} (#${row.id})`)
  }

  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"Product"', 'id'), MAX(id)) FROM "Product";`
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"Category"', 'id'), MAX(id)) FROM "Category";`
  await db.$executeRaw`SELECT setval(pg_get_serial_sequence('"ProductImage"', 'id'), MAX(id)) FROM "ProductImage";`
  console.log(`Published ${PANTY.length} panties into “${category.label}”.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
