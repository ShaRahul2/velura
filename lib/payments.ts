export const PAYMENT_PROVIDER = 'razorpay' as const

export function isOnlineMethod(method: string): boolean {
  return method === 'upi' || method === 'card' || method === 'netbanking'
}

export function razorpayBrowserKey(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''
}

export function razorpayAvailableInBrowser(): boolean {
  return Boolean(razorpayBrowserKey())
}
