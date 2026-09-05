import type { Metadata } from 'next'
import Link from 'next/link'
import { InfoBlock, InfoPage } from '@/components/info/InfoPage'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Write to Velura. hello@velura.in',
}

export default function ContactPage() {
  return (
    <InfoPage kicker="Atelier" title="Write to us.">
      <p>Orders, fit, fabric. One address.</p>
      <InfoBlock title="Email">
        <p>
          <a
            href="mailto:hello@velura.in"
            className="text-deep underline underline-offset-4"
          >
            hello@velura.in
          </a>
        </p>
        <p className="mt-3">We reply within two business days.</p>
      </InfoBlock>
      <InfoBlock title="An order">
        <p>
          Look it up with the order ID and the email used at checkout, on{' '}
          <Link href="/order" className="text-deep underline underline-offset-4">
            Order status
          </Link>
          .
        </p>
      </InfoBlock>
      <InfoBlock title="Hours">
        <p>Monday–Saturday, 10:00–18:00 IST. No walk-ins. The work is made to measure.</p>
      </InfoBlock>
    </InfoPage>
  )
}
