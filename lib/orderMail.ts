import { db } from '@/lib/db'
import { siteUrl } from '@/lib/site'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderItem } from '@prisma/client'

type Kind = 'placed' | 'shipped' | 'cancelled' | 'returned'

function fromAddress() {
  return process.env.ORDER_FROM_EMAIL ?? 'VELURA <hello@thevelura.in>'
}

function lookupUrl(orderId: string) {
  return `${siteUrl()}/order?id=${encodeURIComponent(orderId)}`
}

function lines(order: Order & { items: OrderItem[] }) {
  return order.items
    .map((item) => `${item.qty} × ${item.name} · ${item.size} — ${formatPrice(item.priceAtOrder * item.qty)}`)
    .join('\n')
}

function copy(kind: Kind, order: Order & { items: OrderItem[] }) {
  const name = order.firstName
  const total = formatPrice(order.total)
  const link = lookupUrl(order.id)
  const track =
    order.trackingNumber
      ? `\nCarrier: ${order.carrier ?? '—'}\nTracking: ${order.trackingNumber}`
      : ''

  if (kind === 'placed') {
    return {
      subject: `VELURA ${order.id}`,
      text: `${name},\n\nWe have ${order.id}. ${total}.\n\n${lines(order)}\n\nLook it up: ${link}\n`,
    }
  }
  if (kind === 'shipped') {
    return {
      subject: `VELURA ${order.id} has left us`,
      text: `${name},\n\n${order.id} is on its way.${track}\n\n${link}\n`,
    }
  }
  if (kind === 'returned') {
    return {
      subject: `VELURA ${order.id} returned`,
      text: `${name},\n\n${order.id} is marked returned.${order.paymentStatus === 'refunded' ? ' A refund is on the original method.' : ''}\n\n${link}\n`,
    }
  }
  return {
    subject: `VELURA ${order.id} cancelled`,
    text: `${name},\n\n${order.id} is cancelled.${order.paymentStatus === 'refunded' ? ' A refund is on the original method.' : ''}\n\n${link}\n`,
  }
}

function htmlFromText(text: string) {
  const body = text
    .trim()
    .split('\n')
    .map((line) => (line ? `<p style="margin:0 0 12px;line-height:1.5">${line}</p>` : '<div style="height:8px"></div>'))
    .join('')
  return `<div style="font-family:Georgia,serif;color:#0F0D0B;background:#F8F6F3;padding:32px">
  <p style="letter-spacing:0.22em;font-size:12px;color:#B8A898">VELURA</p>
  <div style="margin-top:24px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:#6B6058">${body}</div>
</div>`
}

async function send(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[order-mail:skipped]', { to, subject })
    }
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [to],
      subject,
      text,
      html: htmlFromText(text),
    }),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    console.error('[order-mail]', res.status, err)
  }
}

export async function notifyOrder(orderId: string, kind: Kind) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return
    if (kind === 'placed') {
      if (order.placedNotifiedAt) return
      const { subject, text } = copy(kind, order)
      await send(order.email, subject, text)
      await db.order.update({
        where: { id: orderId },
        data: { placedNotifiedAt: new Date() },
      })
      return
    }
    const { subject, text } = copy(kind, order)
    await send(order.email, subject, text)
  } catch (err) {
    console.error('[order-mail]', kind, orderId, err)
  }
}
