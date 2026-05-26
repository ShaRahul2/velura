import { db } from '@/lib/db'
import { BadgeType as DbBadge, SupportLevel as DbSupportLevel, type Prisma } from '@prisma/client'
import type { Product, BadgeType, ProductCategory, SupportLevel } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 12

const VALID_CATS:     ProductCategory[] = ['everyday', 'pushup', 'lace', 'sports', 'seamless', 'plus', 'bridal']
const VALID_SUPPORT:  SupportLevel[]    = ['Light', 'Medium', 'High']

// ── Include shape used by all queries ─────────────────────────────────────────
// One definition here; Prisma infers the correct return type automatically.

const PRODUCT_INCLUDE = {
  category: true,
  images:   { orderBy: { position: 'asc' } },
} satisfies Prisma.ProductInclude

type DbProductFull = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>

// ── Mapping ───────────────────────────────────────────────────────────────────

function mapBadge(b: DbBadge | null): BadgeType {
  if (b === null)              return null
  if (b === DbBadge.ComfortFit) return 'Comfort Fit'
  return b as Exclude<BadgeType, null | 'Comfort Fit'>
}

function toBadge(b: string | null): DbBadge | null {
  if (b === null || b === '') return null
  if (b === 'Comfort Fit')   return DbBadge.ComfortFit
  return b as DbBadge
}

export function mapDbProductToProduct(p: DbProductFull): Product {
  return mapProduct(p)
}

function mapProduct(p: DbProductFull): Product {
  const sortedImages = p.images // already ordered by position from the query
  const primaryImage = sortedImages.find((img) => img.isPrimary) ?? sortedImages[0]
  return {
    id:       p.id,
    name:     p.name,
    story:    p.story,
    sub:      p.sub,
    price:    p.price,
    oldPrice: p.oldPrice,
    emoji:    p.emoji,
    badge:    mapBadge(p.badge),
    cat:      p.category.slug as ProductCategory,
    rating:   p.rating,
    reviews:  p.reviewCount,
    fabric:   p.fabric,
    support:  p.support as SupportLevel,
    sizes:    p.sizes,
    images:   sortedImages.map((img) => img.url),
    ...(primaryImage?.blurDataURL && { blurDataURL: primaryImage.blurDataURL }),
  }
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface QueryParams {
  cat?:     string
  support?: string
  sort?:    string
  page?:    number
  limit?:   number
}

// ── queryProducts ─────────────────────────────────────────────────────────────

export async function queryProducts(
  params: QueryParams = {}
): Promise<{ data: Product[]; total: number; page: number }> {
  const page  = Math.max(1, params.page  ?? 1)
  const limit = Math.min(50, Math.max(1, params.limit ?? ITEMS_PER_PAGE))
  const skip  = (page - 1) * limit

  const cat     = VALID_CATS.includes(params.cat as ProductCategory)
    ? (params.cat as ProductCategory) : undefined
  const support = VALID_SUPPORT.includes(params.support as SupportLevel)
    ? (params.support as SupportLevel) : undefined

  // cat filter goes through the Category relation (not a direct column)
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(cat     && { category: { slug: cat } }),
    ...(support && { support }),
  }

  const sort = params.sort ?? ''

  // "New arrivals" needs badge-first ordering which Prisma can't express in a
  // single orderBy clause, so we fetch all matching rows and sort in JS.
  if (sort === 'new') {
    const all = await db.product.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: PRODUCT_INCLUDE,
    })
    const sorted = [
      ...all.filter((p) => p.badge === DbBadge.New),
      ...all.filter((p) => p.badge !== DbBadge.New),
    ]
    return {
      data:  sorted.slice(skip, skip + limit).map(mapProduct),
      total: sorted.length,
      page,
    }
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'rating'     ? { rating: 'desc' } :
    sort === 'price-asc'  ? { price:  'asc'  } :
    sort === 'price-desc' ? { price:  'desc' } :
                            { id:     'asc'  }

  const [rows, total] = await db.$transaction([
    db.product.findMany({ where, orderBy, skip, take: limit, include: PRODUCT_INCLUDE }),
    db.product.count({ where }),
  ])

  return { data: rows.map(mapProduct), total, page }
}

// ── getProductById ────────────────────────────────────────────────────────────

export async function getProductById(id: number): Promise<Product | null> {
  const p = await db.product.findUnique({
    where:   { id },
    include: PRODUCT_INCLUDE,
  })
  return p ? mapProduct(p) : null
}

// ── getRelatedProducts ────────────────────────────────────────────────────────

export async function getRelatedProducts(
  id:  number,
  cat: ProductCategory
): Promise<Product[]> {
  const rows = await db.product.findMany({
    where:   { category: { slug: cat }, id: { not: id } },
    orderBy: { rating: 'desc' },
    take:    4,
    include: PRODUCT_INCLUDE,
  })
  return rows.map(mapProduct)
}

// ── getAllProductIds ───────────────────────────────────────────────────────────

export async function getAllProductIds(): Promise<number[]> {
  const rows = await db.product.findMany({
    select:  { id: true },
    orderBy: { id: 'asc' },
  })
  return rows.map((r) => r.id)
}

// ── getAllCategories ───────────────────────────────────────────────────────────

export async function getAllCategories() {
  return db.category.findMany({ orderBy: { sortOrder: 'asc' } })
}

// ── Admin: queryAllProducts (includes inactive) ────────────────────────────────

export async function queryAllProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    orderBy: { id: 'asc' },
    include: PRODUCT_INCLUDE,
  })
  return rows.map(mapProduct)
}

// ── Admin: createProduct ───────────────────────────────────────────────────────

export interface CreateProductInput {
  name:       string
  story:      string
  sub:        string
  price:      number
  oldPrice?:  number | null
  emoji:      string
  badge?:     string | null
  cat:        ProductCategory
  rating:     number
  reviews:    number
  fabric:     string
  support:    SupportLevel
  sizes:      string
  isActive?:  boolean
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const category = await db.category.findUnique({ where: { slug: data.cat as ProductCategory } })
  if (!category) throw new Error(`Category not found: ${data.cat}`)

  const p = await db.product.create({
    data: {
      name:        data.name,
      story:       data.story,
      sub:         data.sub,
      price:       data.price,
      oldPrice:    data.oldPrice ?? null,
      emoji:       data.emoji,
      badge:       toBadge(data.badge ?? null),
      categoryId:  category.id,
      rating:      data.rating,
      reviewCount: data.reviews,
      fabric:      data.fabric,
      support:     data.support as DbSupportLevel,
      sizes:       data.sizes,
      isActive:    data.isActive ?? true,
    },
    include: PRODUCT_INCLUDE,
  })
  return mapProduct(p)
}

// ── Admin: updateProduct ───────────────────────────────────────────────────────

export async function updateProduct(
  id:   number,
  data: Partial<CreateProductInput>
): Promise<Product> {
  let categoryId: number | undefined
  if (data.cat) {
    const category = await db.category.findUnique({ where: { slug: data.cat as ProductCategory } })
    if (!category) throw new Error(`Category not found: ${data.cat}`)
    categoryId = category.id
  }

  const p = await db.product.update({
    where: { id },
    data: {
      ...(data.name      !== undefined && { name:        data.name }),
      ...(data.story     !== undefined && { story:       data.story }),
      ...(data.sub       !== undefined && { sub:         data.sub }),
      ...(data.price     !== undefined && { price:       data.price }),
      ...(data.oldPrice  !== undefined && { oldPrice:    data.oldPrice }),
      ...(data.emoji     !== undefined && { emoji:       data.emoji }),
      ...(data.badge     !== undefined && { badge:       toBadge(data.badge ?? null) }),
      ...(categoryId     !== undefined && { categoryId }),
      ...(data.rating    !== undefined && { rating:      data.rating }),
      ...(data.reviews   !== undefined && { reviewCount: data.reviews }),
      ...(data.fabric    !== undefined && { fabric:      data.fabric }),
      ...(data.support   !== undefined && { support:     data.support as DbSupportLevel }),
      ...(data.sizes     !== undefined && { sizes:       data.sizes }),
      ...(data.isActive  !== undefined && { isActive:    data.isActive }),
    },
    include: PRODUCT_INCLUDE,
  })
  return mapProduct(p)
}

// ── Admin: setProductActive ────────────────────────────────────────────────────

export async function setProductActive(id: number, isActive: boolean): Promise<void> {
  await db.product.update({ where: { id }, data: { isActive } })
}

// ── Admin: deleteProduct ───────────────────────────────────────────────────────
// Returns S3 keys of deleted images so the caller can clean up S3.

export async function deleteProduct(id: number): Promise<string[]> {
  const images = await db.productImage.findMany({
    where:  { productId: id },
    select: { key: true },
  })
  await db.product.delete({ where: { id } }) // cascades to images + reviews
  return images.map((img) => img.key).filter((k): k is string => k !== null)
}
