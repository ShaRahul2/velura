import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'everyday',
    label: 'Everyday',
    sub: "The bra you forget you're wearing.",
    emoji: '☁️',
    count: 3,
    range: '₹699–₹899',
    bg: 'linear-gradient(145deg, #F4F0EC 0%, #E2DAD0 100%)',
    accentColor: '#B8A898',
    isDark: false,
    span: 'md:col-span-2 md:row-span-2',
    emojiSize: 'text-7xl',
  },
  {
    id: 'lace',
    label: 'Lace',
    sub: 'Delicate. Precise.',
    emoji: '🌸',
    count: 2,
    range: '₹1,399–₹1,599',
    bg: 'linear-gradient(145deg, #FAF6F0 0%, #EDE4D8 100%)',
    accentColor: '#9A8878',
    isDark: false,
    span: '',
    emojiSize: 'text-5xl',
  },
  {
    id: 'sports',
    label: 'Sports',
    sub: 'For the moves that matter.',
    emoji: '🏋️‍♀️',
    count: 2,
    range: '₹799–₹1,099',
    bg: 'linear-gradient(145deg, #1E1916 0%, #2A2218 100%)',
    accentColor: '#B8A898',
    isDark: true,
    span: '',
    emojiSize: 'text-5xl',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    sub: 'Worn once. Remembered forever.',
    emoji: '🤍',
    count: 2,
    range: '₹2,199–₹2,499',
    bg: 'linear-gradient(145deg, #FEFCFA 0%, #F0E8DE 100%)',
    accentColor: '#C4B8A8',
    isDark: false,
    span: '',
    emojiSize: 'text-5xl',
  },
  {
    id: 'plus',
    label: 'Plus',
    sub: 'Built for every curve.',
    emoji: '❤️',
    count: 2,
    range: '₹1,049–₹1,149',
    bg: 'linear-gradient(145deg, #F2EBE3 0%, #DDD0C4 100%)',
    accentColor: '#B8A898',
    isDark: false,
    span: '',
    emojiSize: 'text-5xl',
  },
]

export function CategoryGrid() {
  return (
    <section className="py-20 lg:py-24 2xl:py-28 px-6 md:px-10 max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Shop by category
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)', letterSpacing: '-0.01em' }}
          >
            Every shape. Every occasion.
          </h2>
        </div>
        <p className="hidden md:block font-sans text-[0.78rem] lg:text-[0.84rem] text-mauve">
          7 collections
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[220px] 2xl:auto-rows-[240px] gap-3 lg:gap-4 2xl:gap-5">
        {CATEGORIES.map(({ id, label, sub, emoji, count, range, bg, accentColor, isDark, span, emojiSize }) => (
          <Link
            key={id}
            href={`/shop?cat=${id}`}
            className={`group relative overflow-hidden rounded-card flex flex-col justify-between p-5 ${span}`}
            style={{ background: bg }}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at 70% 30%, ${accentColor}22 0%, transparent 65%)` }}
            />

            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <div
                className="border px-2 py-1 rounded-[2px] font-sans text-[0.62rem] lg:text-[0.68rem] 2xl:text-[0.72rem] tracking-label uppercase"
                style={{
                  borderColor: isDark ? 'rgba(184,168,152,0.3)' : 'rgba(107,96,88,0.2)',
                  color: isDark ? 'rgba(237,233,228,0.7)' : '#6B6058',
                  background: isDark ? 'rgba(237,233,228,0.06)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {count} styles
              </div>
              <span className={`${emojiSize} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`} aria-hidden="true">
                {emoji}
              </span>
            </div>

            {/* Bottom row */}
            <div className="relative z-10">
              <h3
                className="font-serif font-light text-[1.1rem] lg:text-[1.2rem] 2xl:text-[1.3rem] leading-tight mb-1"
                style={{ color: isDark ? '#EDE9E4' : '#0F0D0B' }}
              >
                {label}
              </h3>
              <p
                className="font-sans text-[0.72rem] lg:text-[0.78rem] 2xl:text-[0.84rem] font-light leading-snug mb-2 line-clamp-1"
                style={{ color: isDark ? 'rgba(237,233,228,0.5)' : '#6B6058' }}
              >
                {sub}
              </p>
              <p
                className="font-sans text-[0.65rem] lg:text-[0.7rem] 2xl:text-[0.76rem] tracking-label uppercase"
                style={{ color: isDark ? accentColor : accentColor }}
              >
                {range}
              </p>
            </div>

            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-400"
              style={{ background: accentColor }}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
