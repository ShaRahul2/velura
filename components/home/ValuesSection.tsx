const VALUES = [
  {
    icon: '◈',
    title: 'Built to last',
    body: 'Triple-needle stitching. Tested to 300 washes. Nothing gives way.',
  },
  {
    icon: '◇',
    title: 'Every size',
    body: 'XS to 4XL. 28AA to 50H. Designed, not adjusted.',
  },
  {
    icon: '◉',
    title: 'Free returns',
    body: '15-day hassle-free. We pick up. No questions asked.',
  },
  {
    icon: '◈',
    title: 'Made in India',
    body: 'Ethical factories. Women-led workshops. Local by choice.',
  },
]

export function ValuesSection() {
  return (
    <section
      className="py-20 px-6 md:px-10"
      style={{ background: '#0F0D0B' }}
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="font-sans text-[0.68rem] lg:text-[0.72rem] tracking-label uppercase mb-3"
            style={{ color: '#B8A898' }}
          >
            Why Velura
          </p>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)',
              letterSpacing: '-0.01em',
              color: '#EDE9E4',
            }}
          >
            The support you always wanted.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {VALUES.map(({ icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-4 p-6 rounded-card"
              style={{ border: '1px solid rgba(184,168,152,0.14)' }}
            >
              <span
                className="font-serif text-[1.6rem]"
                style={{ color: '#B8A898' }}
                aria-hidden="true"
              >
                {icon}
              </span>
              <h3
                className="font-serif text-[1.05rem] lg:text-[1.15rem] font-light"
                style={{ color: '#EDE9E4' }}
              >
                {title}
              </h3>
              <p
                className="font-sans text-[0.82rem] lg:text-[0.88rem] font-light leading-relaxed"
                style={{ color: 'rgba(237,233,228,0.5)' }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
