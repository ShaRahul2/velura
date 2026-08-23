import Image from 'next/image'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const PLATES = [
  {
    src: '/images/lookbook/01.jpg',
    alt: 'Champagne silk, morning light',
    caption: 'Silk',
    href: '/shop?cat=everyday',
    className: 'md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[560px]',
  },
  {
    src: '/images/lookbook/02.jpg',
    alt: 'Black lace on linen',
    caption: 'Lace',
    href: '/shop?cat=lace',
    className: 'aspect-[3/4] md:aspect-auto',
  },
  {
    src: '/images/lookbook/03.jpg',
    alt: 'Velvet in low light',
    caption: 'Velvet',
    href: '/shop?cat=pushup',
    className: 'aspect-[3/4] md:aspect-auto',
  },
]

export function Lookbook() {
  return (
    <section className="py-16 md:py-24">
      <div className={pageWrap}>
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
              This season
            </p>
            <h2
              className="font-serif font-light text-deep"
              style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.02em' }}
            >
              Photographed in pearl light.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:block font-sans text-[0.78rem] tracking-btn uppercase text-mauve hover:text-deep underline underline-offset-4"
          >
            Explore Collection
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-3 md:h-[560px]">
          {PLATES.map((plate) => (
            <Link
              key={plate.src}
              href={plate.href}
              className={`group relative overflow-hidden bg-blush ${plate.className}`}
            >
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover img-zoom"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.48) 0%, transparent 100%)' }}
              />
              <p className="absolute bottom-4 left-4 font-serif italic text-blush text-[1.08rem]">
                {plate.caption}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
