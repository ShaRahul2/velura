import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order status',
  description: 'Look up a Velura order with your order ID and email.',
  robots: { index: false, follow: false },
}

export default function OrderLookupLayout({ children }: { children: React.ReactNode }) {
  return children
}
