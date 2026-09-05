import type { Order, OrderStatus, PaymentStatus } from '@prisma/client'

export type OrderActionId = 'confirm' | 'ship' | 'deliver' | 'collect' | 'cancel' | 'return' | 'refund'

export type OrderAction = {
  id: OrderActionId
  label: string
  hint: string
  danger?: boolean
}

type OrderState = Pick<
  Order,
  'status' | 'paymentStatus' | 'paymentMethod' | 'razorpayPaymentId' | 'total'
>

function isPaid(status: PaymentStatus) {
  return status === 'paid'
}

function isTerminal(status: OrderStatus) {
  return status === 'cancelled' || status === 'returned'
}

function onlineUnpaid(order: OrderState) {
  return order.paymentMethod !== 'cod' && !isPaid(order.paymentStatus) && order.paymentStatus !== 'refunded'
}

function cancelAction(order: OrderState): OrderAction {
  if (isPaid(order.paymentStatus)) {
    return {
      id: 'cancel',
      label: order.paymentMethod === 'cod' || !order.razorpayPaymentId ? 'Cancel · manual refund completed' : 'Cancel & refund',
      hint: order.paymentMethod === 'cod' || !order.razorpayPaymentId ? 'Only confirm after returning the full payment to the customer outside this app.' : 'Stops the order and requests a full refund to the original payment.',
      danger: true,
    }
  }
  return {
    id: 'cancel',
    label: 'Cancel order',
    hint: 'No capture to refund.',
    danger: true,
  }
}

export function availableOrderActions(order: OrderState): OrderAction[] {
  if (order.paymentStatus === 'refunded') return []
  if (isTerminal(order.status)) {
    if (isPaid(order.paymentStatus)) {
      return [{
        id: 'refund',
        label: order.paymentMethod === 'cod' || !order.razorpayPaymentId ? 'Confirm manual refund completed' : 'Refund payment',
        hint: order.paymentMethod === 'cod' || !order.razorpayPaymentId
          ? 'Only confirm after returning the full payment outside this app.'
          : 'Refunds the captured Razorpay payment.',
        danger: true,
      }]
    }
    return []
  }

  const actions: OrderAction[] = []
  const paid = isPaid(order.paymentStatus)
  const cod = order.paymentMethod === 'cod'

  if (order.status === 'pending') {
    if (!onlineUnpaid(order)) {
      actions.push({ id: 'confirm', label: 'Confirm', hint: 'Accepted. Ready to pack.' })
    }
    actions.push(cancelAction(order))
  }

  if (order.status === 'confirmed') {
    if (!onlineUnpaid(order)) actions.push({ id: 'ship', label: 'Mark shipped', hint: 'It has left us.' })
    if (cod && !paid) {
      actions.push({ id: 'collect', label: 'COD collected', hint: 'Cash received.' })
    }
    actions.push(cancelAction(order))
  }

  if (order.status === 'shipped') {
    if (!onlineUnpaid(order)) actions.push({ id: 'deliver', label: 'Mark delivered', hint: 'The customer has it.' })
    if (cod && !paid) {
      actions.push({ id: 'collect', label: 'COD collected', hint: 'Cash received.' })
    }
    actions.push(cancelAction(order))
  }

  if (order.status === 'delivered') {
    if (cod && !paid) {
      actions.push({ id: 'collect', label: 'COD collected', hint: 'Cash received on delivery.' })
    }
    if (paid) {
      actions.push({
        id: 'return',
        label: order.paymentMethod === 'cod' || !order.razorpayPaymentId ? 'Return · manual refund completed' : 'Return & refund',
        hint: order.paymentMethod === 'cod' || !order.razorpayPaymentId ? 'Only confirm after returning the full payment outside this app.' : 'Marks returned and requests a full refund through Razorpay.',
        danger: true,
      })
    } else {
      actions.push({
        id: 'return',
        label: 'Mark returned',
        hint: 'No payment to refund.',
        danger: true,
      })
    }
  }

  return actions
}

export function actionNeedsConfirm(action: OrderActionId) {
  return action === 'cancel' || action === 'return' || action === 'refund'
}

/** Customer may cancel only before the parcel leaves. */
export function customerCanCancel(status: OrderStatus) {
  return status === 'pending' || status === 'confirmed'
}
