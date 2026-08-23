import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <div
      className="h-8 flex items-center justify-center px-4"
      style={{
        background: '#0F0D0B',
        borderBottom: '1px solid rgba(184,168,152,0.14)',
      }}
    >
      <p
        className="font-sans text-[0.62rem] md:text-[0.68rem] tracking-[0.14em] uppercase truncate"
        style={{ color: 'rgba(237,233,228,0.72)' }}
      >
        Free shipping above ₹999
        <span className="mx-2.5 opacity-30" aria-hidden="true">
          ·
        </span>
        15-day returns
        <span className="mx-2.5 opacity-30 hidden sm:inline" aria-hidden="true">
          ·
        </span>
        <Link
          href="/builder"
          className="hidden sm:inline underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
          style={{ color: '#B8A898' }}
        >
          Build yours
        </Link>
      </p>
    </div>
  )
}
