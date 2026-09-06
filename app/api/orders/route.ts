import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { type PaymentMethod, Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { calcShipping, calcDiscount, COD_LIMIT } from '@/lib/coupons'
import { calculateBuilderPrice } from '@/lib/builderPricing'
import { requireCustomerId } from '@/lib/staffAuth'
import { clearCart } from '@/lib/accountCommerce'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

// ── Zod schemas ───────────────────────────────────────────────────────────────

const OrderItemSchema = z.object({
  productId:  z.number().int().positive().nullable(),
  name:       z.string().min(1).max(200),
  qty:        z.number().int().min(1).max(10),
  price:      z.number().int().positive(),
  size:       z.string().min(1).max(20),
  customSpec: z.unknown().optional().nullable(),
})

const AddressSchema = z.object({
  firstName:   z.string().min(1).max(50),
  lastName:    z.string().min(1).max(50),
  email:       z.string().email(),
  phone:       z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  addressLine: z.string().min(5).max(200),
  city:        z.string().min(1).max(100),
  state:       z.string().min(1).max(100),
  pinCode:     z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
  placeId:     z.string().max(256).optional(),
  lat:         z.number().optional(),
  lng:         z.number().optional(),
})

const OrderSchema = z.object({
  items:         z.array(OrderItemSchema).min(1).max(50),
  address:       AddressSchema,
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'cod']),
  couponCode:    z.string().max(32).optional().nullable(),
})

// ── Price lookup — DB first, static catalog fallback ─────────────────────────

async function getProductPriceMap(ids: number[]): Promise<Map<number, number>> {
  if (ids.length === 0) return new Map()
  try {
    const rows = await db.product.findMany({
      where:  { id: { in: ids }, isActive: true },
      select: { id: true, price: true },
    })
    return new Map(rows.map((r) => [r.id, r.price]))
  } catch {
    // DB not connected — fall back to static catalog prices
    const { products } = await import('@/data/products')
    return new Map(
      products.filter((p) => ids.includes(p.id)).map((p) => [p.id, p.price])
    )
  }
}

// ── POST /api/orders ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    if (!(await checkRateLimit(`orders:${clientIp(req)}`, 12, 10 * 60 * 1000))) {
      return NextResponse.json({ error: 'Too many orders in a short time. Please wait a few minutes.' }, { status: 429 })
    }

    const body   = await req.json()
    const parsed = OrderSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid request'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const { items, address, paymentMethod, couponCode } = parsed.data

    // Fetch authoritative prices from DB (or static fallback)
    const productIds = items
      .map((i) => i.productId)
      .filter((id): id is number => id !== null)
    const priceMap = await getProductPriceMap(productIds)

    // Verify all referenced products exist
    for (const item of items) {
      if (item.productId !== null && !priceMap.has(item.productId)) {
        return NextResponse.json(
          { error: `Product ${item.productId} is unavailable` },
          { status: 422 }
        )
      }
    }

    // Recalculate subtotal from server-authoritative prices
    const subtotal = items.reduce((sum, item) => {
      if (item.productId !== null) {
        return sum + (priceMap.get(item.productId) ?? 0) * item.qty
      }
      // Custom bra: recompute from the spec server-side; never trust item.price
      return sum + calculateBuilderPrice(item.customSpec) * item.qty
    }, 0)

    const shipping = calcShipping(subtotal)
    const discount = calcDiscount(couponCode, subtotal)
    const total    = Math.max(0, subtotal + shipping - discount)

    // COD limit
    if (paymentMethod === 'cod' && total > COD_LIMIT) {
      return NextResponse.json(
        { error: `Cash on Delivery is only available for orders up to ₹${COD_LIMIT.toLocaleString('en-IN')}` },
        { status: 422 }
      )
    }

    const orderId = `VLR-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const profileId = await requireCustomerId()
    const shippingSnapshot = {
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
    }

    // Persist to DB
    try {
      await db.order.create({
        data: {
          id:            orderId,
          status:        paymentMethod === 'cod' ? 'confirmed' : 'pending',
          paymentMethod: paymentMethod as PaymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
          couponCode:    couponCode?.toUpperCase() ?? null,
          subtotal,
          shipping,
          discount,
          total,
          firstName:   address.firstName,
          lastName:    address.lastName,
          email:       address.email,
          phone:       address.phone,
          addressLine: address.addressLine,
          city:        address.city,
          state:       address.state,
          pinCode:     address.pinCode,
          placeId:     address.placeId ?? null,
          lat:         address.lat ?? null,
          lng:         address.lng ?? null,
          shippingSnapshot,
          profileId:   profileId,
          items: {
            create: items.map((item) => ({
              productId:    item.productId,
              name:         item.name,
              size:         item.size,
              qty:          item.qty,
              priceAtOrder: item.productId !== null
                ? (priceMap.get(item.productId) ?? item.price)
                : calculateBuilderPrice(item.customSpec),
              ...(item.customSpec != null && { customSpec: item.customSpec as Prisma.InputJsonValue }),
            })),
          },
        },
      })
    } catch (dbErr) {
      if (process.env.NODE_ENV !== 'production') {
        // Expected during development before `prisma db push` is run
        console.warn('[orders] DB write skipped (run `prisma db push` to enable persistence):', dbErr)
      } else {
        console.error('[orders] DB write failed:', dbErr)
        return NextResponse.json({ error: 'Order could not be saved. Please try again.' }, { status: 503 })
      }
    }

    if (profileId) {
      try {
        await clearCart(profileId)
      } catch {
        /* client still clears the local bag after Place Order */
      }
    }

    if (paymentMethod === 'cod') {
      const { notifyOrder } = await import('@/lib/orderMail')
      void notifyOrder(orderId, 'placed')
    }

    return NextResponse.json({ data: { orderId, total } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const profileId = await requireCustomerId()
    if (!profileId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const orders = await db.order.findMany({
      where: { profileId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({
      data: orders.map((order) => ({
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        subtotal: order.subtotal,
        shipping: order.shipping,
        createdAt: order.createdAt,
        items: order.items,
        address: {
          firstName: order.firstName,
          lastName: order.lastName,
          addressLine: order.addressLine,
          city: order.city,
          state: order.state,
          pinCode: order.pinCode,
        },
      })),
    })
  } catch (err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
