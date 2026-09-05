import type { Metadata } from 'next'
import Link from 'next/link'
import { InfoBlock, InfoPage } from '@/components/info/InfoPage'

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'How Velura sizes band and cup. 26AA–52K.',
}

export default function SizeGuidePage() {
  return (
    <InfoPage kicker="Fit" title="Size, without the theatre.">
      <p>
        Band from the underbust, rounded up to the even inch. Cup from the difference to the fullest
        point. We cut 26AA–52K — designed, not adjusted.
      </p>
      <InfoBlock title="Band">
        <p>
          Measure firmly under the bust, exhale. Convert to inches, round up to the next even number.
          That is your band. 26 through 52.
        </p>
      </InfoBlock>
      <InfoBlock title="Cup">
        <p>
          Measure at the fullest point, standing. Subtract the underbust. Each 2 cm (about 1 inch)
          is a cup: AA, A, B, C, D, DD, DDD, F, G, H, I, J, K.
        </p>
      </InfoBlock>
      <InfoBlock title="If the number is uncertain">
        <p>
          Use the fit calculator in the custom builder. Twenty minutes. No guesswork.
        </p>
        <p className="mt-4">
          <Link
            href="/builder"
            className="font-sans text-[0.78rem] tracking-btn uppercase text-deep underline underline-offset-4"
          >
            Build Yours
          </Link>
        </p>
      </InfoBlock>
    </InfoPage>
  )
}
