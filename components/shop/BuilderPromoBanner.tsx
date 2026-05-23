import Link from 'next/link'

export function BuilderPromoBanner() {
  return (
    <div
      className="my-8 px-8 py-6 rounded-card flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ background: '#0F0D0B' }}
    >
      <div>
        <p
          className="font-sans text-[0.68rem] tracking-label uppercase mb-1.5"
          style={{ color: '#B8A898' }}
        >
          ✦ Custom Bra Builder
        </p>
        <p
          className="font-serif text-[1.05rem] font-light"
          style={{ color: '#EDE9E4' }}
        >
          Your size. Your fabric. Your fit.
        </p>
      </div>
      <Link
        href="/builder"
        className="shrink-0 inline-flex items-center h-10 px-6 rounded-btn font-sans text-[0.78rem] tracking-btn uppercase transition-all duration-200 hover:tracking-wide"
        style={{ background: '#B8A898', color: '#0F0D0B' }}
      >
        Build Yours
      </Link>
    </div>
  )
}
