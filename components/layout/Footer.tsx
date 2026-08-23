import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const COLS = [
  {
    title: 'Collections',
    links: [
      { label: 'Everyday',  href: '/shop?cat=everyday' },
      { label: 'Push-Up',   href: '/shop?cat=pushup' },
      { label: 'Lace',      href: '/shop?cat=lace' },
      { label: 'Sports',    href: '/shop?cat=sports' },
      { label: 'Seamless',  href: '/shop?cat=seamless' },
      { label: 'Plus',      href: '/shop?cat=plus' },
      { label: 'Bridal',    href: '/shop?cat=bridal' },
    ],
  },
  {
    title: 'Custom',
    links: [
      { label: '✦ Build Yours',   href: '/builder' },
      { label: 'Fit Calculator',  href: '/builder' },
      { label: 'All collections', href: '/shop' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Size Guide',      href: '/builder' },
      { label: 'Shipping',        href: '/shop' },
      { label: 'Returns',         href: '/shop' },
      { label: 'Contact',         href: 'mailto:hello@velura.in' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-deep text-blush">
      <div className={`${pageWrap} pt-16 lg:pt-20 pb-10`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-[1.55rem] tracking-logo mb-3" style={{ color: '#EDE9E4' }}>
              VELURA
            </p>
            <p className="font-sans text-[0.82rem] font-light leading-relaxed" style={{ color: 'rgba(237,233,228,0.45)' }}>
              Crafted for the woman who knows.
            </p>
            <p className="font-sans text-[0.72rem] mt-4" style={{ color: 'rgba(237,233,228,0.35)' }}>
              ₹499 – ₹2,499 · XS–4XL · 26AA–52K
            </p>
            <p className="font-sans text-[0.72rem] mt-5 leading-relaxed" style={{ color: 'rgba(237,233,228,0.35)' }}>
              UPI · Cards · Net Banking · COD
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p
                className="font-sans text-[0.68rem] tracking-label uppercase mb-5"
                style={{ color: '#B8A898' }}
              >
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[0.82rem] font-light transition-colors duration-200 hover:text-blush"
                      style={{ color: 'rgba(237,233,228,0.45)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t" style={{ borderColor: 'rgba(184,168,152,0.14)' }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-7">
          <p className="font-sans text-[0.7rem]" style={{ color: 'rgba(237,233,228,0.3)' }}>
            © {new Date().getFullYear()} Velura. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Shipping'].map((label) => (
              <span
                key={label}
                className="font-sans text-[0.7rem]"
                style={{ color: 'rgba(237,233,228,0.3)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
