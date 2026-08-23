import Link from 'next/link'
import Image from 'next/image'

export function BuilderPromoBanner() {
  return (
    <div className="my-10 overflow-hidden rounded-card relative min-h-[160px] flex items-stretch">
      <div className="absolute inset-0">
        <Image
          src="/images/categories/lace.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(15,13,11,0.62)' }} />
      </div>
      <div className="relative z-10 flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-7 md:px-8">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase mb-1.5" style={{ color: '#B8A898' }}>
            ✦ Custom Bra Builder
          </p>
          <p className="font-serif text-[1.25rem] md:text-[1.45rem] font-light" style={{ color: '#EDE9E4' }}>
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
    </div>
  )
}
