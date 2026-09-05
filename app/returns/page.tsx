import type { Metadata } from 'next'
import { InfoBlock, InfoPage } from '@/components/info/InfoPage'

export const metadata: Metadata = {
  title: 'Returns',
  description: '15-day returns on unused pieces. Custom builds exchange on defects only.',
}

export default function ReturnsPage() {
  return (
    <InfoPage kicker="Aftercare" title="If it is not the one.">
      <p>Fifteen days. Unused, with tags. We arrange the pickup.</p>
      <InfoBlock title="Ready pieces">
        <p>
          Return within 15 days of delivery if unworn, unwashed, and tagged. We collect. Refund to
          the original method, or store credit — your choice.
        </p>
      </InfoBlock>
      <InfoBlock title="Custom builds">
        <p>
          Made to your measurements. Exchange on manufacturing defects only. Fit that was specified
          correctly is not a defect.
        </p>
      </InfoBlock>
      <InfoBlock title="COD">
        <p>Available on orders under ₹5,000. Returns follow the same 15-day window.</p>
      </InfoBlock>
    </InfoPage>
  )
}
