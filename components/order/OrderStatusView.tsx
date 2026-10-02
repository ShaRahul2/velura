import { formatOrderDate, formatOrderMoney, type PublicOrder } from '@/lib/orderPublic'

export function OrderStatusView({
  order,
  onCancel,
  cancelling,
}: {
  order: PublicOrder
  onCancel?: () => void
  cancelling?: boolean
}) {
  return (
    <div className="w-full text-left">
      <div className="mb-8 grid grid-cols-2 gap-px bg-lm md:grid-cols-4">
        <Stat label="Fulfilment" value={order.fulfilment} />
        <Stat label="Payment" value={order.payment} />
        <Stat label="Method" value={order.method} />
        <Stat label="Placed" value={formatOrderDate(order.createdAt)} />
      </div>

      <p className="mb-8 font-sans text-[0.84rem] font-light leading-relaxed text-mauve">
        {order.note}
      </p>

      {order.tracking ? (
        <div className="mb-8 border border-lm px-4 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-sans text-[0.62rem] tracking-label uppercase text-rose">Tracking</p>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.08em] text-mauve">
              {order.tracking.statusLabel}
            </p>
          </div>
          <p className="mt-1 font-sans text-[0.88rem] text-deep">
            {order.tracking.courier ? `${order.tracking.courier} · ` : ''}
            {order.tracking.awb ?? '—'}
          </p>
          {order.tracking.estimatedDelivery && !order.tracking.deliveredAt && (
            <p className="mt-1 font-sans text-[0.74rem] text-mauve">
              Expected by {formatOrderDate(order.tracking.estimatedDelivery)}
            </p>
          )}
          {order.tracking.trackingUrl && (
            <a
              href={order.tracking.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-sans text-[0.72rem] uppercase tracking-btn text-deep underline underline-offset-4"
            >
              Track parcel
            </a>
          )}

          {order.tracking.events.length > 0 && (
            <ol className="mt-5 space-y-3 border-l border-lm pl-4">
              {order.tracking.events.map((ev, i) => (
                <li key={`${ev.occurredAt}-${i}`} className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 h-2 w-2 rounded-full ${i === 0 ? 'bg-deep' : 'bg-lm'}`}
                  />
                  <p className="font-sans text-[0.8rem] text-deep">{ev.description}</p>
                  <p className="mt-0.5 font-sans text-[0.66rem] text-mauve">
                    {ev.label}
                    {ev.location ? ` · ${ev.location}` : ''} · {formatOrderDate(ev.occurredAt)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : (
        (order.trackingNumber || order.carrier) && (
          <div className="mb-8 border border-lm px-4 py-4">
            <p className="mb-1 font-sans text-[0.62rem] tracking-label uppercase text-rose">Tracking</p>
            <p className="font-sans text-[0.88rem] text-deep">
              {order.carrier ? `${order.carrier} · ` : ''}
              {order.trackingNumber ?? '—'}
            </p>
          </div>
        )
      )}

      <div className="border-t border-lm">
        {order.items.map((item) => (
          <div
            key={`${item.name}-${item.size}`}
            className="flex items-baseline justify-between gap-4 border-b border-lm py-4"
          >
            <div>
              <p className="font-serif text-[1.05rem] font-light text-deep">{item.name}</p>
              <p className="mt-1 font-sans text-[0.72rem] uppercase tracking-[0.08em] text-mauve">
                {item.custom ? 'Custom · ' : ''}
                Size {item.size} · Qty {item.qty}
              </p>
            </div>
            <p className="shrink-0 font-sans text-[0.92rem] tabular-nums text-deep">
              {formatOrderMoney(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-2">
        <Row label="Subtotal" value={formatOrderMoney(order.subtotal)} />
        <Row label="Shipping" value={order.shipping === 0 ? 'Free' : formatOrderMoney(order.shipping)} />
        {order.discount > 0 && <Row label="Discount" value={`−${formatOrderMoney(order.discount)}`} />}
        <div className="flex items-baseline justify-between pt-2">
          <dt className="font-sans text-[0.68rem] tracking-label uppercase text-deep">Total</dt>
          <dd className="font-sans text-[1.05rem] tabular-nums text-deep">{formatOrderMoney(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-10 border-t border-lm pt-6">
        <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">Deliver to</p>
        <p className="font-sans text-[0.88rem] text-deep">{order.shipTo.name}</p>
        <p className="mt-1 font-sans text-[0.84rem] font-light leading-relaxed text-mauve">
          {order.shipTo.addressLine}
          <br />
          {order.shipTo.city}, {order.shipTo.state} {order.shipTo.pinCode}
        </p>
      </div>

      {order.canCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={cancelling}
          className="mt-10 font-sans text-[0.72rem] tracking-btn uppercase text-mauve underline underline-offset-4 disabled:opacity-40"
        >
          {cancelling ? 'Cancelling…' : 'Cancel this order'}
        </button>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream px-4 py-4">
      <p className="mb-1.5 font-sans text-[0.62rem] tracking-label uppercase text-rose">{label}</p>
      <p className="font-sans text-[0.88rem] text-deep">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-sans text-[0.78rem] text-mauve">{label}</dt>
      <dd className="font-sans text-[0.84rem] tabular-nums text-deep">{value}</dd>
    </div>
  )
}
