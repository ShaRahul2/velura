import Image from 'next/image'
import Link from 'next/link'

export function AtelierBanner() {
  return (
    <section className="relative min-h-[420px] md:min-h-[520px] flex items-center">
      <Image
        src="/images/lookbook/atelier.jpg"
        alt="The Velura atelier"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(15,13,11,0.62) 0%, rgba(15,13,11,0.18) 70%)' }}
      />
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-xl py-16">
        <p className="font-sans text-[0.68rem] tracking-label uppercase mb-4" style={{ color: '#B8A898' }}>
          The atelier
        </p>
        <p
          className="font-serif font-light italic leading-snug mb-6"
          style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)', color: '#EDE9E4' }}
        >
          Cut on the table. Fitted to the woman who will wear it.
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center h-11 px-7 rounded-btn font-sans text-[0.78rem] tracking-btn uppercase"
          style={{ background: '#B8A898', color: '#0F0D0B' }}
        >
          Build Yours
        </Link>
      </div>
    </section>
  )
}
