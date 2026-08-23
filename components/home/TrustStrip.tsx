import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const FACTS = [
  { label: '26AA – 52K', href: '/builder' },
  { label: 'Free shipping above ₹999', href: '/shop' },
  { label: '15-day easy returns', href: '/shop' },
  { label: 'Made in India', href: '/' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-lm bg-cream">
      <div
        className={`${pageWrap} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-lm`}
      >
        {FACTS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-center py-4 md:py-5 px-3 text-center font-sans text-[0.68rem] md:text-[0.72rem] tracking-label uppercase text-mauve hover:text-deep transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  )
}
