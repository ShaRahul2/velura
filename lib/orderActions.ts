import { Prisma, type Order, type OrderStatus, type PaymentStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { refundRazorpayPayment, type StoredPaymentDetails } from '@/lib/razorpay'

import { availableOrderActions, type OrderActionId } from './orderActionPolicy'
export { availableOrderActions, actionNeedsConfirm, customerCanCancel, type OrderActionId } from './orderActionPolicy'

export type OrderActionExtras = {
  carrier?: string
  trackingNumber?: string
}

function mergePaymentDetails(
  current: Prisma.JsonValue | null,
  patch: Partial<StoredPaymentDetails>,
): Prisma.InputJsonValue {
  const base =
    current && typeof current === 'object' && !Array.isArray(current)
      ? (current as Record<string, unknown>)
      : {}
  return { ...base, ...patch } as Prisma.InputJsonValue
}

async function refundIfCaptured(order: Order) {
  if (order.paymentStatus !== 'paid') {
    return { paymentStatus: order.paymentStatus as PaymentStatus, paymentDetails: order.paymentDetails }
  }

  if (order.paymentMethod === 'cod' || !order.razorpayPaymentId) {
    return {
      paymentStatus: 'refunded' as const,
      paymentDetails: mergePaymentDetails(order.paymentDetails, {
        refundStatus: 'manual',
        refundedAt: new Date().toISOString(),
      }),
    }
  }

  try {
    const refund = await refundRazorpayPayment({
      paymentId: order.razorpayPaymentId,
      amountRupees: order.total,
      orderId: order.id,
    })
    return {
      paymentStatus: 'refunded' as const,
      paymentDetails: mergePaymentDetails(order.paymentDetails, {
        refundId: refund.id,
        refundStatus: refund.status,
        refundedAt: new Date().toISOString(),
      }),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/already refunded|fully refunded/i.test(message)) {
      return {
        paymentStatus: 'refunded' as const,
        paymentDetails: mergePaymentDetails(order.paymentDetails, {
          refundStatus: 'already_refunded',
          refundedAt: new Date().toISOString(),
        }),
      }
    }
    throw err
  }
}

export async function applyOrderAction(orderId: string, action: OrderActionId, extras: OrderActionExtras = {}) {
  return db.$transaction(async (tx) => {
  await tx.$queryRaw(Prisma.sql`SELECT id FROM "Order" WHERE id = ${orderId} FOR UPDATE`)
  const order = await tx.order.findUnique({ where: { id: orderId } })
  if (!order) {
    throw new Error('Order not found')
  }
  if (!availableOrderActions(order).some((item) => item.id === action)) {
    throw new Error('That action is not available for this order.')
  }

  if (action === 'confirm') {
    return tx.order.update({ where: { id: orderId }, data: { status: 'confirmed' } })
  }
  if (action === 'ship') {
    return tx.order.update({
      where: { id: orderId },
      data: {
        status: 'shipped',
        carrier: extras.carrier?.trim() || order.carrier,
        trackingNumber: extras.trackingNumber?.trim() || order.trackingNumber,
      },
    })
  }
  if (action === 'deliver') {
    return tx.order.update({ where: { id: orderId }, data: { status: 'delivered' } })
  }
  if (action === 'collect') {
    return tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        paidAt: new Date(),
        paymentDetails: mergePaymentDetails(order.paymentDetails, {
          provider: 'razorpay',
          razorpayPaymentId: order.razorpayPaymentId ?? '',
          razorpayOrderId: order.razorpayOrderId ?? '',
          status: 'cod_collected',
          method: 'cod',
        }),
      },
    })
  }

  const refund = await refundIfCaptured(order)
  if (action === 'refund') {
    return tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: refund.paymentStatus,
        paymentDetails: refund.paymentDetails ?? undefined,
      },
    })
  }
  const status: OrderStatus = action === 'return' ? 'returned' : 'cancelled'
  return tx.order.update({
    where: { id: orderId },
    data: {
      status,
      paymentStatus: refund.paymentStatus,
      paymentDetails: refund.paymentDetails ?? undefined,
    },
  })
  }, { timeout: 30000, maxWait: 5000 })
}
