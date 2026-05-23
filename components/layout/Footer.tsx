import Link from 'next/link'

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
      { label: 'Saved Designs',   href: '/builder' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Size Guide',      href: '#' },
      { label: 'Care Guide',      href: '#' },
      { label: 'Returns',         href: '#' },
      { label: 'Track Order',     href: '#' },
      { label: 'Contact',         href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-deep text-blush">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-[1.6rem] tracking-logo mb-3" style={{ color: '#EDE9E4' }}>
              VELURA
            </p>
            <p className="font-sans text-[0.8rem] font-light leading-relaxed" style={{ color: 'rgba(237,233,228,0.45)' }}>
              Crafted for the woman who knows.
            </p>
            <p className="font-sans text-[0.72rem] mt-4" style={{ color: 'rgba(237,233,228,0.35)' }}>
              ₹499 – ₹2,499 · XS–4XL · 28AA–50H
            </p>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p
                className="font-sans text-[0.68rem] tracking-label uppercase mb-5"
                style={{ color: '#B8A898' }}
              >
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[0.8rem] font-light transition-colors duration-200"
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

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'rgba(184,168,152,0.14)' }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-7">
          <p className="font-sans text-[0.7rem]" style={{ color: 'rgba(237,233,228,0.3)' }}>
            © {new Date().getFullYear()} Velura. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Shipping'].map((label) => (
              <Link
                key={label}
                href="#"
                className="font-sans text-[0.7rem] transition-colors"
                style={{ color: 'rgba(237,233,228,0.3)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
