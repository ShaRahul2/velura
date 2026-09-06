/**
 * Back-compat shim. Order notifications now live in `lib/notify` and fan out to
 * email + WhatsApp. Existing imports of `notifyOrder` from here keep working.
 */
export { notifyOrder, type OrderEventKind } from '@/lib/notify'
