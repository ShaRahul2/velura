import type { Metadata } from 'next'
import { InfoBlock, InfoPage } from '@/components/info/InfoPage'

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'Free shipping above ₹999. India-wide.',
}

export default function ShippingPage() {
  return (
    <InfoPage kicker="Delivery" title="How it arrives.">
      <p>We ship across India. UPI, cards, net banking, and COD on orders under ₹5,000.</p>
      <InfoBlock title="Cost">
        <p>Free above ₹999. A flat ₹79 below that.</p>
      </InfoBlock>
      <InfoBlock title="Time">
        <p>
          Ready pieces: 3–5 business days after confirmation. Custom builds: 7–10 days. Look up
          status any time under Help → Order status.
        </p>
      </InfoBlock>
      <InfoBlock title="Where">
        <p>Serviceable PIN codes across India. Enter yours at checkout — city and state fill from it.</p>
      </InfoBlock>
    </InfoPage>
  )
}
