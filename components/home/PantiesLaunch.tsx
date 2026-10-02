import Link from 'next/link'
import Image from 'next/image'
import { PANTY_CUTS } from '@/lib/pantyCuts'
import { formatPrice, pageWrap } from '@/lib/utils'

// A bra and panty photographed in the same nude shade.
const SET = {
  braHref: '/shop/1',
  braImage: '/images/products/feathersoft-1.jpg',
  braPrice: 699,
  pantyName: 'CottonDay',
  pantyHref: '/shop/43',
  pantyImage: '/images/products/cottonday-1.jpg',
  pantyPrice: 499,
}

export function PantiesLaunch() {
  return (
    <section className={`bg-cream pb-20 md:pb-28 ${pageWrap}`}>
      <div className="grid overflow-hidden rounded-card bg-deep text-blush lg:grid-cols-2">
        <div className="flex flex-col gap-8 px-6 py-12 md:px-14 md:py-16">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose">New · Panties</p>
          <h2
            className="font-serif font-light leading-[1.02]"
            style={{ fontSize: 'clamp(2.2rem, 4.6vw, 4rem)', letterSpacing: '-0.01em' }}
          >
            The other half
            <br />
            of the set.
          </h2>
          <p className="max-w-md font-sans text-[0.92rem] font-light leading-relaxed text-blush/70">
            Six cuts in the knits and shades of our bras. Worn closest. Noticed least.
          </p>

          <ul className="grid grid-cols-3 gap-px border border-nav-border bg-nav-border">
            {PANTY_CUTS.map((cut) => (
              <li key={cut.id} className="bg-deep">
                <Link
                  href="/shop?cat=panties"
                  className="group flex h-full flex-col gap-3 px-3 py-4 transition-colors duration-200 hover:bg-blush/5 md:px-4"
                >
                  <svg
                    viewBox="0 0 64 48"
                    className="h-9 w-12 text-rose transition-colors duration-200 group-hover:text-blush"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    aria-hidden="true"
                  >
                    <path d={cut.path} />
                  </svg>
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-sans text-[0.82rem]">{cut.label}</span>
                    <span className="hidden font-sans text-[0.6rem] tracking-label uppercase text-rose sm:inline">
                      {cut.coverage}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop?cat=panties"
              className="pressable pressable-track inline-flex h-12 items-center rounded-btn bg-blush px-8 font-sans text-[0.78rem] tracking-btn uppercase text-deep"
            >
              Explore Collection
            </Link>
            <Link
              href="/builder?garment=panties"
              className="inline-flex h-12 items-center rounded-btn border border-rose px-6 font-sans text-[0.78rem] tracking-btn uppercase text-rose transition-colors duration-200 hover:bg-rose hover:text-deep"
            >
              Build Yours
            </Link>
          </div>
        </div>

        <div className="grid grid-rows-[minmax(0,1fr)_auto] border-t border-nav-border lg:border-l lg:border-t-0">
          <div className="grid min-h-[340px] grid-cols-2 gap-px bg-nav-border md:min-h-[460px]">
            <Link href={SET.braHref} className="group relative overflow-hidden bg-deep">
              <Image
                src={SET.braImage}
                alt="FeatherSoft bra in nude"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                quality={70}
                className="object-cover img-zoom"
              />
              <span className="absolute left-3 top-3 rounded-badge bg-cream px-2 py-1 font-sans text-[0.6rem] tracking-label uppercase text-deep">
                Bra
              </span>
            </Link>
            <Link href={SET.pantyHref} className="group relative overflow-hidden bg-blush">
              <Image
                src={SET.pantyImage}
                alt="CottonDay panty in nude"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                quality={70}
                className="object-cover img-zoom"
              />
              <span className="absolute left-3 top-3 rounded-badge bg-deep px-2 py-1 font-sans text-[0.6rem] tracking-label uppercase text-blush">
                Panty
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-8">
            <div>
              <p className="font-sans text-[0.62rem] tracking-label uppercase text-rose">
                Same knit · same shade
              </p>
              <p className="mt-1 font-serif text-[1.35rem] font-light">FeatherSoft, with {SET.pantyName}.</p>
            </div>
            <div className="flex items-center gap-5">
              <p className="font-sans text-[1rem] text-blush">
                {formatPrice(SET.braPrice)} + {formatPrice(SET.pantyPrice)}
              </p>
              <Link
                href={SET.pantyHref}
                className="inline-flex h-11 items-center rounded-btn border border-rose px-5 font-sans text-[0.74rem] tracking-btn uppercase text-blush transition-colors duration-200 hover:bg-blush hover:text-deep"
              >
                View the Set
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
