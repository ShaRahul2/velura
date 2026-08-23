import { pageWrap } from '@/lib/utils'

const VALUES = [
  {
    title: 'Built to last',
    body: 'Triple-needle stitching. Tested to 300 washes. Nothing gives way.',
  },
  {
    title: 'Every size',
    body: 'XS to 4XL. 26AA to 52K. Designed, not adjusted.',
  },
  {
    title: 'Free returns',
    body: '15-day hassle-free. We pick up. No questions asked.',
  },
  {
    title: 'Made in India',
    body: 'Ethical factories. Women-led workshops. Local by choice.',
  },
]

export function ValuesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24" style={{ background: '#0F0D0B' }}>
      <div className={pageWrap}>
        <div className="mb-10 md:mb-14">
          <p className="font-sans text-[0.68rem] tracking-label uppercase mb-3" style={{ color: '#B8A898' }}>
            Why Velura
          </p>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)',
              letterSpacing: '-0.01em',
              color: '#EDE9E4',
            }}
          >
            The support you always wanted.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(184,168,152,0.14)' }}>
          {VALUES.map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-3 p-6 md:p-8" style={{ background: '#0F0D0B' }}>
              <h3 className="font-serif text-[1.15rem] font-light" style={{ color: '#EDE9E4' }}>
                {title}
              </h3>
              <p className="font-sans text-[0.84rem] font-light leading-relaxed" style={{ color: 'rgba(237,233,228,0.5)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
