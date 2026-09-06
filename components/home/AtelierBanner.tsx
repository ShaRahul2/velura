import Image from 'next/image'
import Link from 'next/link'

export function AtelierBanner() {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-deep md:min-h-[680px]">
      <Image
        src="/images/lookbook/atelier.jpg"
        alt="The Velura atelier"
        fill
        sizes="100vw"
        quality={70}
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(15,13,11,0.82) 0%, rgba(15,13,11,0.42) 48%, rgba(15,13,11,0.10) 100%)',
        }}
      />
      <div className="relative z-10 max-w-xl px-8 py-20 md:px-20 lg:px-28">
        <p className="mb-4 font-sans text-[0.68rem] tracking-label uppercase text-rose">
          ✦ Custom Bra
        </p>
        <p
          className="mb-4 font-serif font-light leading-[1.05] text-blush"
          style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)', letterSpacing: '-0.02em' }}
        >
          Built from the measurements people actually live in.
        </p>
        <p className="mb-8 max-w-sm font-sans text-[0.92rem] font-light leading-relaxed text-blush/62">
          Band, cup, fabric, finish — specified, not approximated.
        </p>
        <Link
          href="/builder"
          className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-rose px-8 font-sans text-[0.78rem] tracking-btn uppercase text-deep"
        >
          Build Yours
        </Link>
      </div>
    </section>
  )
}
