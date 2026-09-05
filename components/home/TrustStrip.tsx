import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const FACTS = [
  { label: '26AA–52K', href: '/builder' },
  { label: 'Free shipping above ₹999', href: '/shop' },
  { label: '15-day returns', href: '/shop' },
  { label: 'Cut in India', href: '/' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-lm bg-cream">
      <div className={`${pageWrap} grid grid-cols-2 divide-x divide-y divide-lm lg:grid-cols-4 lg:divide-y-0`}>
        {FACTS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-center px-3 py-4 text-center font-sans text-[0.68rem] tracking-label uppercase text-mauve transition-colors hover:text-deep md:py-5 md:text-[0.72rem]"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  )
}
