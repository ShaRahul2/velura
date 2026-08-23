import Image from 'next/image'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

const PLATES = [
  { src: '/images/lookbook/01.jpg', alt: 'Champagne silk, morning light', caption: 'Silk', href: '/shop?cat=everyday' },
  { src: '/images/lookbook/02.jpg', alt: 'Black lace on linen', caption: 'Lace', href: '/shop?cat=lace' },
  { src: '/images/lookbook/03.jpg', alt: 'Velvet in low light', caption: 'Velvet', href: '/shop?cat=pushup' },
  { src: '/images/lookbook/04.jpg', alt: 'Ivory embroidered bridal', caption: 'Bridal', href: '/shop?cat=bridal' },
]

export function Lookbook() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className={pageWrap}>
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
              Lookbook
            </p>
            <h2
              className="font-serif font-light text-deep"
              style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.01em' }}
            >
              The atelier, this season.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:block font-sans text-[0.78rem] tracking-btn uppercase text-mauve hover:text-deep underline underline-offset-4"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 px-1.5 md:px-2">
        {PLATES.map((plate) => (
          <Link key={plate.src} href={plate.href} className="group relative aspect-[3/4] overflow-hidden bg-blush">
            <Image
              src={plate.src}
              alt={plate.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.5) 0%, transparent 100%)' }}
            />
            <p className="absolute bottom-3 left-3 font-serif italic text-blush text-[1.02rem]">
              {plate.caption}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center font-serif italic text-mauve text-[1.02rem]">
        Photographed in pearl light. Nothing extra.
      </p>
    </section>
  )
}
