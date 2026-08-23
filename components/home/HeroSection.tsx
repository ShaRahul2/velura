import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-blush">
      <Image
        src="/images/hero/campaign.jpg"
        alt="Velura campaign — crafted for the woman who knows"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_18%]"
        style={{ animation: 'ken 18s ease-out both' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,246,243,0.28) 0%, rgba(248,246,243,0.04) 34%, rgba(15,13,11,0.62) 100%)',
        }}
      />

      <div className="relative z-10 w-full px-5 md:px-10 lg:px-16 xl:px-20 pb-16 md:pb-20 lg:pb-24 pt-32">
        <div className="max-w-xl" style={{ animation: 'fadeUp 0.8s ease both' }}>
          <p className="font-sans text-[0.68rem] tracking-label uppercase mb-4 text-blush/80">
            New season · Made in India
          </p>

          <h1
            className="font-serif font-light leading-[1.04] mb-5 text-blush"
            style={{
              fontSize: 'clamp(2.6rem, 6.2vw, 5.4rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Crafted for
            <br />
            the woman
            <br />
            who knows.
          </h1>

          <p className="font-sans text-[0.95rem] font-light text-blush/75 leading-relaxed mb-8 max-w-sm">
            Disappears under anything.
            <br />
            Remembered by your body.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase bg-blush text-deep hover:tracking-wide transition-[letter-spacing,background-color,color,transform] duration-200 active:scale-[0.98]"
            >
              Explore Collection
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase border border-blush/70 text-blush hover:bg-blush hover:text-deep transition-[letter-spacing,background-color,color,transform] duration-200 active:scale-[0.98]"
            >
              ✦ Build Yours
            </Link>
          </div>

          <p className="mt-8 font-sans text-[0.68rem] tracking-label uppercase text-blush/55">
            26AA–52K · XS–4XL
          </p>
        </div>
      </div>
    </section>
  )
}
