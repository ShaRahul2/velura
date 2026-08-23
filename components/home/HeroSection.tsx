import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative flex flex-col lg:flex-row overflow-hidden lg:h-[calc(100svh-6rem)] lg:min-h-[640px] lg:max-h-[820px]">
      {/* Editorial copy */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 md:px-10 lg:px-16 xl:px-20 py-14 lg:py-0 bg-cream">
        <div className="max-w-xl" style={{ animation: 'fadeUp 0.7s ease both' }}>
          <p className="font-sans text-[0.68rem] tracking-label uppercase mb-5 text-rose">
            New season · Made in India
          </p>

          <h1
            className="font-serif font-light leading-[1.06] mb-5 text-deep"
            style={{
              fontSize: 'clamp(2.4rem, 5.4vw, 4.6rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Crafted for
            <br />
            the woman
            <br />
            who knows.
          </h1>

          <p className="font-sans text-[0.95rem] font-light text-mauve leading-relaxed mb-9 max-w-sm">
            Disappears under anything.
            <br />
            Remembered by your body.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all duration-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
            >
              ✦ Build Yours
            </Link>
          </div>
        </div>
      </div>

      {/* Campaign photograph */}
      <div className="relative w-full lg:w-[52%] min-h-[58vh] lg:min-h-full bg-blush">
        <Image
          src="/images/hero/campaign.jpg"
          alt="Velura campaign — crafted for the woman who knows"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover object-[center_18%]"
        />

        <div
          className="absolute top-6 right-6 border px-3 py-1.5"
          style={{
            borderColor: 'rgba(237,233,228,0.35)',
            background: 'rgba(15,13,11,0.28)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
          }}
        >
          <p className="font-sans text-[0.62rem] tracking-label uppercase" style={{ color: '#EDE9E4' }}>
            26AA – 52K
          </p>
        </div>

      </div>
    </section>
  )
}
