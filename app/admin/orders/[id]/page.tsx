import { requireAdmin } from '@/lib/adminSession'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { OrderActions } from '@/components/admin/OrderActions'
import { OrderTrackingForm } from '@/components/admin/OrderTrackingForm'
import { ORDER_LABEL, PAYMENT_LABEL, adminTone, formatAdminDate } from '@/lib/adminOrders'
import type { StoredPaymentDetails } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

const SPEC_LABEL: Record<string, string> = {
  sizeMode: 'Size mode',
  band: 'Band',
  cup: 'Cup',
  braType: 'Type',
  strapStyle: 'Straps',
  padding: 'Padding',
  underwire: 'Underwire',
  closure: 'Closure',
  support: 'Support',
  fabric: 'Fabric',
  color: 'Colour',
  fitUnit: 'Unit',
}

function asPaymentDetails(value: unknown): StoredPaymentDetails | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Partial<StoredPaymentDetails>
  if (row.provider !== 'razorpay') return null
  return row as StoredPaymentDetails
}

function asSpec(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'string' && v.length > 0)
    .map(([k, v]) => [k, v as string])
  return entries.length > 0 ? Object.fromEntries(entries) : null
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) notFound()

  const pay = asPaymentDetails(order.paymentDetails)

  return (
    <div className="p-8">
      <Link
        href="/admin/orders"
        className="font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[rgba(237,233,228,0.4)] hover:text-[#EDE9E4]"
      >
        ← Orders
      </Link>

      <div className="mt-6 mb-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-[1.4rem] font-light tracking-[-0.01em] text-[#EDE9E4]">
            {order.id}
          </h1>
          <p className="mt-1 font-sans text-[0.72rem] text-[rgba(237,233,228,0.35)]">
            Placed {formatAdminDate(order.createdAt)}
          </p>
        </div>
        <OrderActions
          orderId={order.id}
          status={order.status}
          paymentStatus={order.paymentStatus}
          paymentMethod={order.paymentMethod}
          razorpayPaymentId={order.razorpayPaymentId}
          total={order.total}
        />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-px bg-[rgba(184,168,152,0.12)] lg:grid-cols-4">
        <Stat label="Fulfilment" value={ORDER_LABEL[order.status]} tone={adminTone(order.status)} />
        <Stat label="Payment" value={PAYMENT_LABEL[order.paymentStatus]} tone={adminTone(order.paymentStatus)} />
        <Stat label="Method" value={order.paymentMethod.toUpperCase()} />
        <Stat label="Total" value={formatPrice(order.total)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <section>
          <h2 className="mb-4 font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
            Pieces
          </h2>
          <div className="overflow-hidden rounded-[4px] border border-[rgba(184,168,152,0.1)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(184,168,152,0.1)] bg-[rgba(237,233,228,0.03)]">
                  {['Item', 'Size', 'Qty', 'Price'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-sans text-[0.62rem] font-normal uppercase tracking-[0.12em] text-[rgba(237,233,228,0.35)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const spec = asSpec(item.customSpec)
                  return (
                    <tr key={item.id} className="border-b border-[rgba(184,168,152,0.07)] last:border-0">
                      <td className="px-4 py-3 align-top">
                        <p className="font-sans text-[0.82rem] text-[#EDE9E4]">{item.name}</p>
                        {item.productId == null && (
                          <p className="mt-0.5 font-sans text-[0.62rem] uppercase tracking-[0.08em] text-[#B8A898]">
                            Custom
                          </p>
                        )}
                        {spec && (
                          <p className="mt-2 font-sans text-[0.68rem] leading-relaxed text-[rgba(237,233,228,0.45)]">
                            {Object.entries(spec)
                              .map(([k, v]) => `${SPEC_LABEL[k] ?? k}: ${v}`)
                              .join(' · ')}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top font-sans text-[0.78rem] text-[rgba(237,233,228,0.65)]">
                        {item.size}
                      </td>
                      <td className="px-4 py-3 align-top font-sans text-[0.78rem] text-[rgba(237,233,228,0.65)]">
                        {item.qty}
                      </td>
                      <td className="px-4 py-3 align-top font-sans text-[0.82rem] tabular-nums text-[#EDE9E4]">
                        {formatPrice(item.priceAtOrder * item.qty)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <dl className="mt-6 ml-auto w-full max-w-xs space-y-2">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={order.shipping === 0 ? 'Free' : formatPrice(order.shipping)} />
            {order.discount > 0 && <Row label="Discount" value={`−${formatPrice(order.discount)}`} />}
            {order.couponCode && <Row label="Coupon" value={order.couponCode} />}
            <div className="flex justify-between border-t border-[rgba(184,168,152,0.12)] pt-2">
              <dt className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#EDE9E4]">Total</dt>
              <dd className="font-sans text-[0.95rem] tabular-nums text-[#EDE9E4]">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-8">
          <section>
            <h2 className="mb-4 font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
              Contact
            </h2>
            <p className="mb-4 font-sans text-[0.95rem] text-[#EDE9E4]">
              {order.firstName} {order.lastName}
            </p>
            <dl className="space-y-3">
              <div>
                <dt className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(237,233,228,0.4)]">
                  Phone
                </dt>
                <dd className="mt-1 font-sans text-[0.88rem] text-[#EDE9E4]">
                  <a href={`tel:+91${order.phone}`} className="underline decoration-[rgba(184,168,152,0.35)] underline-offset-4">
                    +91 {order.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(237,233,228,0.4)]">
                  Email
                </dt>
                <dd className="mt-1 break-all font-sans text-[0.88rem] text-[#EDE9E4]">
                  <a href={`mailto:${order.email}`} className="underline decoration-[rgba(184,168,152,0.35)] underline-offset-4">
                    {order.email}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`tel:+91${order.phone}`}
                className="inline-flex h-9 items-center rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#EDE9E4]"
              >
                Call
              </a>
              <a
                href={`https://wa.me/91${order.phone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#EDE9E4]"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${order.email}?subject=${encodeURIComponent(`VELURA ${order.id}`)}`}
                className="inline-flex h-9 items-center rounded-[3px] border border-[rgba(184,168,152,0.25)] px-3 font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[#EDE9E4]"
              >
                Email
              </a>
            </div>
            {pay?.contact && pay.contact.replace(/\D/g, '').slice(-10) !== order.phone && (
              <p className="mt-3 font-sans text-[0.68rem] text-[rgba(237,233,228,0.4)]">
                Razorpay contact: {pay.contact}
              </p>
            )}
            {pay?.email && pay.email.toLowerCase() !== order.email.toLowerCase() && (
              <p className="mt-1 font-sans text-[0.68rem] text-[rgba(237,233,228,0.4)]">
                Razorpay email: {pay.email}
              </p>
            )}
          </section>

          <OrderTrackingForm
            orderId={order.id}
            carrier={order.carrier}
            trackingNumber={order.trackingNumber}
          />

          <section>
            <h2 className="mb-4 font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
              Deliver to
            </h2>
            <p className="font-sans text-[0.82rem] leading-relaxed text-[rgba(237,233,228,0.75)]">
              {order.addressLine}
              <br />
              {order.city}, {order.state} {order.pinCode}
            </p>
            {order.lat != null && order.lng != null && (
              <p className="mt-2 font-sans text-[0.65rem] text-[rgba(237,233,228,0.35)]">
                {order.lat.toFixed(5)}, {order.lng.toFixed(5)}
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-sans text-[0.62rem] uppercase tracking-[0.12em] text-[#B8A898]">
              Payment record
            </h2>
            <dl className="space-y-2">
              <Row label="Status" value={PAYMENT_LABEL[order.paymentStatus]} />
              <Row label="Paid at" value={formatAdminDate(order.paidAt)} />
              {order.razorpayOrderId && <Row label="Razorpay order" value={order.razorpayOrderId} />}
              {order.razorpayPaymentId && <Row label="Payment id" value={order.razorpayPaymentId} />}
              {pay?.method && <Row label="Rail" value={pay.method} />}
              {pay?.vpa && <Row label="UPI" value={pay.vpa} />}
              {pay?.cardLast4 && (
                <Row label="Card" value={`${pay.cardNetwork ?? 'Card'} · ${pay.cardLast4}`} />
              )}
              {pay?.bank && <Row label="Bank" value={pay.bank} />}
              {pay?.wallet && <Row label="Wallet" value={pay.wallet} />}
              {pay?.refundId && <Row label="Refund id" value={pay.refundId} />}
              {pay?.refundStatus && <Row label="Refund" value={pay.refundStatus} />}
              {pay?.refundedAt && <Row label="Refunded at" value={pay.refundedAt} />}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-[#141210] px-5 py-4">
      <p className="font-sans text-[0.62rem] tracking-[0.12em] uppercase text-[#B8A898]">{label}</p>
      <p className={`mt-2 font-sans text-[0.95rem] ${tone ?? 'text-[#EDE9E4]'}`}>{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-sans text-[0.68rem] text-[rgba(237,233,228,0.4)]">{label}</dt>
      <dd className="break-all text-right font-sans text-[0.72rem] text-[#EDE9E4]">{value}</dd>
    </div>
  )
}
