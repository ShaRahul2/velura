import Image from 'next/image'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const PLATES = [
  {
    src: '/images/lookbook/01.jpg',
    alt: 'Champagne silk, morning light',
    caption: 'Silk',
    href: '/shop?cat=everyday',
  },
  {
    src: '/images/lookbook/02.jpg',
    alt: 'Black lace on linen',
    caption: 'Lace',
    href: '/shop?cat=lace',
  },
  {
    src: '/images/lookbook/03.jpg',
    alt: 'Velvet in low light',
    caption: 'Velvet',
    href: '/shop?cat=pushup',
  },
  {
    src: '/images/lookbook/04.jpg',
    alt: 'Ivory, held to the light',
    caption: 'Bridal',
    href: '/shop?cat=bridal',
  },
]

export function Lookbook() {
  return (
    <section className={`bg-cream py-20 md:py-28 ${pageWrap}`}>
      <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
        <div className="max-w-2xl">
          <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            Lookbook
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)', letterSpacing: '-0.01em' }}
          >
            Sheer where it can be. Strong where it has to be.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden font-sans text-[0.78rem] tracking-btn uppercase text-mauve underline underline-offset-4 hover:text-deep md:block"
        >
          Explore Collection
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {PLATES.map((plate) => (
          <Link
            key={plate.src}
            href={plate.href}
            className="group relative aspect-[3/4] overflow-hidden bg-blush"
          >
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover img-zoom"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
              style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.5) 0%, transparent 100%)' }}
            />
            <p className="absolute bottom-4 left-4 font-serif text-[1.15rem] italic text-blush">
              {plate.caption}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
