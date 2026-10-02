# Shipping & fulfilment

## How it works

```
Order (paid / COD, status = confirmed)
  └─ admin: "Create shipment"  ──►  Shiprocket: create order → assign AWB
                                     → schedule pickup → generate label
  └─ Shipment row created, Order.status → shipped, customer emailed + WhatsApp'd
        │
        ├─ Shiprocket webhook  ──►  POST /api/shipping/webhook   (real-time)
        └─ Vercel Cron (3h)    ──►  GET  /api/shipping/sync       (fallback)
             │
             └─ ShipmentEvent rows appended (deduped)
                Shipment.status re-derived
                Order.status → delivered on final scan
                out_for_delivery / delivered notifications sent once each
```

- **`Shipment`** — 1:1 with `Order`. `provider` is `shiprocket` or `manual`.
- **`ShipmentStatus`** — granular lifecycle (`in_transit`, `out_for_delivery`, …).
  `Order.status` stays coarse (`shipped` / `delivered`) and is kept in step.
- **`ShipmentEvent`** — the courier scan timeline. `@@unique([shipmentId, status, occurredAt])`
  makes webhook + poll ingestion idempotent.
- `Order.carrier` / `Order.trackingNumber` are mirrored from the shipment so the
  existing order UI and emails keep working unchanged.

## Provider selection

`getShippingProvider()` returns **shiprocket** when `SHIPROCKET_EMAIL` +
`SHIPROCKET_PASSWORD` are set, otherwise **manual** (admin enters AWB + courier
by hand in the order page; nothing is polled).

## Shiprocket setup

1. **API user** — Shiprocket dashboard → Settings → API → *Create an API User*.
   This is a separate credential, not your login. Put it in `SHIPROCKET_EMAIL` /
   `SHIPROCKET_PASSWORD`.
2. **Pickup address** — Settings → Company → Pickup Addresses. The nickname
   (default `Primary`) goes in `SHIPROCKET_PICKUP_LOCATION`.
3. **Webhook** — Settings → API → Webhooks → URL
   `https://www.thevelura.in/api/shipping/webhook`. Set a secret token there and
   put the same value in `SHIPROCKET_WEBHOOK_TOKEN` (sent as `x-api-key`).
4. **Wallet** — AWB assignment fails with an empty wallet. On sandbox / no
   balance the shipment is still created (status `pending`) and the admin can
   retry "Create shipment" or add the AWB manually.

## Cron

`vercel.json` registers `/api/shipping/sync` every 3 hours. Set `CRON_SECRET` in
Vercel — Cron requests carry it as `Authorization: Bearer …`. The job only polls
non-terminal Shiprocket shipments, 40 per run.

## WhatsApp notifications

Meta WhatsApp Cloud API. Inert unless `WHATSAPP_PHONE_NUMBER_ID` +
`WHATSAPP_ACCESS_TOKEN` are set. Each lifecycle event maps to an **approved
template** via `WHATSAPP_TEMPLATE_<EVENT>`; an unset template name means that
event is email-only. Templates take body parameters in this order:

| Event              | Params                          |
|--------------------|---------------------------------|
| `PLACED`           | name, order id, total           |
| `SHIPPED`          | name, order id, AWB             |
| `OUT_FOR_DELIVERY` | name, order id                  |
| `DELIVERED`        | name, order id                  |
| `CANCELLED`        | name, order id                  |
| `RETURNED`         | name, order id                  |

To use a BSP (Interakt / Gupshup / MSG91) instead, replace the fetch in
`lib/notify/whatsapp.ts` — nothing else changes.

## Manual testing

- Sandbox order → admin → *Create shipment* → confirm a `Shipment` row + AWB.
- `curl -X POST /api/shipping/webhook -H 'x-api-key: <token>' -d '{"awb":"<awb>","shipment_status_id":17,"shipment_status":"Out For Delivery","current_timestamp":"2026-01-02T09:00:00Z","scans":[]}'`
  → shipment flips to `out_for_delivery`, one email + WhatsApp sent.
- Repeat with `shipment_status_id: 7` → `delivered`, `Order.status = delivered`.
