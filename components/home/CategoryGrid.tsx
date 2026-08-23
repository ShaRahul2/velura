import Link from 'next/link'
import Image from 'next/image'
import { pageWrap } from '@/lib/utils'

const CATEGORIES = [
  {
    id: 'everyday',
    label: 'Everyday',
    sub: "The bra you forget you're wearing.",
    image: '/images/categories/everyday.jpg',
    span: 'col-span-2 row-span-2 min-h-[280px] md:min-h-0',
  },
  {
    id: 'lace',
    label: 'Lace',
    sub: 'Delicate. Precise.',
    image: '/images/categories/lace.jpg',
    span: '',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    sub: 'Worn once. Remembered forever.',
    image: '/images/categories/bridal.jpg',
    span: '',
  },
  {
    id: 'sports',
    label: 'Sports',
    sub: 'For the moves that matter.',
    image: '/images/categories/sports.jpg',
    span: '',
  },
  {
    id: 'seamless',
    label: 'Seamless',
    sub: 'Invisible under anything.',
    image: '/images/categories/seamless.jpg',
    span: '',
  },
  {
    id: 'plus',
    label: 'Plus',
    sub: 'Built for every curve.',
    image: '/images/categories/plus.jpg',
    span: '',
  },
  {
    id: 'pushup',
    label: 'Push-Up',
    sub: 'Shape, then forgotten.',
    image: '/images/categories/pushup.jpg',
    span: '',
  },
]

export function CategoryGrid() {
  return (
    <section className={`py-16 md:py-24 ${pageWrap}`}>
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Shop the body
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.02em' }}
          >
            Every shape. Every occasion.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:block font-sans text-[0.78rem] tracking-btn uppercase text-mauve hover:text-deep transition-colors underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[260px] gap-2 md:gap-3">
        {CATEGORIES.map(({ id, label, sub, image, span }) => (
          <Link
            key={id}
            href={`/shop?cat=${id}`}
            className={`group relative overflow-hidden bg-blush ${span}`}
          >
            <Image
              src={image}
              alt={label}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover img-zoom"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.58) 0%, rgba(15,13,11,0.05) 58%)' }}
            />
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
              <h3 className="font-serif font-light text-[1.2rem] md:text-[1.45rem] leading-tight text-blush">
                {label}
              </h3>
              <p className="font-sans text-[0.72rem] font-light mt-0.5 line-clamp-1 text-blush/70">
                {sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
