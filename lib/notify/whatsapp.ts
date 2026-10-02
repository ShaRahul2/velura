import type { OrderEventKind } from './copy'

/**
 * Meta WhatsApp Cloud API (graph.facebook.com). Business-initiated messages in
 * India must use an approved template, so each event kind maps to a template
 * name via env. If a kind has no template configured it is skipped (the plain
 * `whatsappText` only reaches the user inside a 24h customer-service window,
 * which order notifications are not).
 *
 * A different BSP (Interakt / Gupshup / MSG91) can replace `postTemplate` only.
 */
const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || 'v21.0'

const TEMPLATE_ENV: Record<OrderEventKind, string> = {
  placed: 'WHATSAPP_TEMPLATE_PLACED',
  shipped: 'WHATSAPP_TEMPLATE_SHIPPED',
  out_for_delivery: 'WHATSAPP_TEMPLATE_OUT_FOR_DELIVERY',
  delivered: 'WHATSAPP_TEMPLATE_DELIVERED',
  cancelled: 'WHATSAPP_TEMPLATE_CANCELLED',
  returned: 'WHATSAPP_TEMPLATE_RETURNED',
}

export function isWhatsappConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN)
}

function templateFor(kind: OrderEventKind): string | null {
  return process.env[TEMPLATE_ENV[kind]] || null
}

/** 10-digit Indian mobile → E.164 without the plus, as the Graph API expects. */
function toRecipient(phone10: string): string | null {
  const digits = phone10.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  return null
}

export async function sendWhatsapp(
  phone10: string,
  kind: OrderEventKind,
  params: string[],
): Promise<void> {
  if (!isWhatsappConfigured()) {
    if (process.env.NODE_ENV !== 'production') console.info('[notify:whatsapp:skipped]', { kind })
    return
  }
  const template = templateFor(kind)
  if (!template) {
    if (process.env.NODE_ENV !== 'production') console.info('[notify:whatsapp:no-template]', { kind })
    return
  }
  const to = toRecipient(phone10)
  if (!to) {
    console.error('[notify:whatsapp] bad recipient', phone10)
    return
  }

  const lang = process.env.WHATSAPP_TEMPLATE_LANG || 'en'
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: template,
      language: { code: lang },
      components: params.length
        ? [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }]
        : undefined,
    },
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) console.error('[notify:whatsapp]', res.status, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[notify:whatsapp]', err)
  }
}
