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
    <section className="bg-deep py-16 md:py-20 lg:py-24">
      <div className={pageWrap}>
        <div className="mb-10 md:mb-14">
          <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            Why Velura
          </p>
          <h2
            className="font-serif font-light text-blush"
            style={{
              fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)',
              letterSpacing: '-0.01em',
            }}
          >
            The support you always wanted.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-rose/14 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-3 bg-deep p-6 md:p-8">
              <h3 className="font-serif text-[1.15rem] font-light text-blush">
                {title}
              </h3>
              <p className="font-sans text-[0.84rem] font-light leading-relaxed text-blush/50">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
