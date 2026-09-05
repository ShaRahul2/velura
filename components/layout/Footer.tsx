import Link from 'next/link'
import { pageWrap } from '@/lib/utils'
import { Newsletter } from '@/components/home/Newsletter'

const COLS = [
  {
    title: 'Collections',
    links: [
      { label: 'Everyday', href: '/shop?cat=everyday' },
      { label: 'Push-Up', href: '/shop?cat=pushup' },
      { label: 'Lace', href: '/shop?cat=lace' },
      { label: 'Sports', href: '/shop?cat=sports' },
      { label: 'Seamless', href: '/shop?cat=seamless' },
      { label: 'Plus', href: '/shop?cat=plus' },
      { label: 'Bridal', href: '/shop?cat=bridal' },
    ],
  },
  {
    title: 'Custom',
    links: [
      { label: 'Build Yours', href: '/builder' },
      { label: 'Fit Calculator', href: '/builder' },
      { label: 'All collections', href: '/shop' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Orders', href: '/orders' },
      { label: 'Guest lookup', href: '/order' },
      { label: 'Account', href: '/account' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-deep pb-16 text-blush md:pb-0">
      <Newsletter />

      <div className={`${pageWrap} pb-10 pt-4`}>
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="mb-4 font-serif text-[1.45rem] tracking-logo text-blush">VELURA</p>
            <p className="font-serif text-[1.05rem] font-light italic leading-snug text-blush/70">
              Crafted for the woman who knows.
            </p>
            <p className="mt-6 font-sans text-[0.72rem] tracking-[0.08em] uppercase text-blush/40">
              26AA–52K · XS–4XL
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-5 font-sans text-[0.68rem] tracking-label uppercase text-rose">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[0.82rem] font-light text-blush/45 transition-colors duration-200 hover:text-blush"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 pt-7 md:flex-row">
          <p className="font-sans text-[0.7rem] text-blush/30">
            © {new Date().getFullYear()} Velura. All rights reserved.
          </p>
          <p className="font-sans text-[0.7rem] text-blush/30">
            UPI · Cards · Net Banking · COD
          </p>
        </div>
      </div>
    </footer>
  )
}
