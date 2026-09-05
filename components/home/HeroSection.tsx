import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-deep">
      <Image
        src="/images/hero/campaign.jpg"
        alt="Velura campaign — crafted for the woman who knows"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_18%] md:object-[center_15%]"
        style={{ animation: 'ken 22s cubic-bezier(0.23, 1, 0.32, 1) both' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(15,13,11,0.68) 0%, rgba(15,13,11,0.22) 48%, rgba(15,13,11,0.04) 100%), linear-gradient(180deg, rgba(15,13,11,0.55) 0%, rgba(15,13,11,0.00) 28%, rgba(15,13,11,0.00) 52%, rgba(15,13,11,0.72) 100%)',
        }}
      />

      <p
        className="pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] select-none font-serif font-light leading-none text-blush/[0.07]"
        style={{ fontSize: 'clamp(8rem, 28vw, 22rem)' }}
        aria-hidden="true"
      >
        VELURA
      </p>

      <p className="absolute right-5 top-1/2 hidden -translate-y-1/2 font-sans text-[0.62rem] tracking-label uppercase text-blush/45 [writing-mode:vertical-rl] md:right-8 lg:right-12 lg:block">
        Campaign 01 · SS26
      </p>

      <div className="relative z-10 w-full px-5 pb-20 pt-32 md:px-16 md:pb-24 lg:px-24 lg:pb-28 xl:px-28">
        <div
          className="max-w-[40rem]"
          style={{ animation: 'fadeUp 0.55s cubic-bezier(0.23, 1, 0.32, 1) both' }}
        >
          <p className="mb-5 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            Crafted for the woman who knows
          </p>

          <h1
            className="mb-6 font-serif font-light leading-[0.96] text-blush"
            style={{
              fontSize: 'clamp(3.1rem, 7.4vw, 7.2rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Disappears
            <br />
            under anything.
          </h1>

          <p className="mb-9 max-w-md font-sans text-[1rem] font-light leading-relaxed text-blush/72 md:text-[1.08rem]">
            Remembered by your body. Premium Indian lingerie, cut 26AA–52K.
          </p>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <Link
              href="/shop"
              className="pressable pressable-track inline-flex h-12 items-center justify-center rounded-btn bg-blush px-8 font-sans text-[0.8rem] tracking-btn uppercase text-deep"
            >
              Explore Collection
            </Link>
            <Link
              href="/builder"
              className="pressable pressable-track inline-flex h-12 items-center justify-center rounded-btn border border-blush/35 px-8 font-sans text-[0.8rem] tracking-btn uppercase text-blush hover:border-blush hover:bg-blush hover:text-deep"
            >
              Build Yours
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
