import Link from 'next/link'
import Image from 'next/image'
import { pageWrap } from '@/lib/utils'

const CATEGORIES = [
  {
    id: 'everyday',
    label: 'Everyday',
    sub: "The bra you forget you're wearing.",
    count: 9,
    image: '/images/categories/everyday.jpg',
    span: 'col-span-2',
  },
  {
    id: 'lace',
    label: 'Lace',
    sub: 'Delicate. Precise.',
    count: 6,
    image: '/images/categories/lace.jpg',
    span: '',
  },
  {
    id: 'pushup',
    label: 'Push-Up',
    sub: 'Shape, then forgotten.',
    count: 6,
    image: '/images/categories/pushup.jpg',
    span: '',
  },
  {
    id: 'sports',
    label: 'Sports',
    sub: 'For the moves that matter.',
    count: 6,
    image: '/images/categories/sports.jpg',
    span: '',
  },
  {
    id: 'seamless',
    label: 'Seamless',
    sub: 'Invisible under anything.',
    count: 5,
    image: '/images/categories/seamless.jpg',
    span: '',
  },
  {
    id: 'plus',
    label: 'Plus',
    sub: 'Built for every curve.',
    count: 5,
    image: '/images/categories/plus.jpg',
    span: '',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    sub: 'Worn once. Remembered forever.',
    count: 5,
    image: '/images/categories/bridal.jpg',
    span: '',
  },
]

export function CategoryGrid() {
  return (
    <section className={`py-16 md:py-20 lg:py-24 ${pageWrap}`}>
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Shop by category
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.01em' }}
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

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[210px] md:auto-rows-[240px] lg:auto-rows-[280px] gap-2.5 md:gap-3">
        {CATEGORIES.map(({ id, label, sub, count, image, span }) => (
          <Link
            key={id}
            href={`/shop?cat=${id}`}
            className={`group relative overflow-hidden rounded-card ${span}`}
          >
            <Image
              src={image}
              alt={label}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(15,13,11,0.62) 0%, rgba(15,13,11,0.08) 55%)' }}
            />

            <div className="absolute top-3 left-3">
              <span
                className="font-sans text-[0.58rem] tracking-label uppercase px-2 py-1"
                style={{
                  borderRadius: 2,
                  border: '1px solid rgba(237,233,228,0.28)',
                  color: 'rgba(237,233,228,0.85)',
                  background: 'rgba(15,13,11,0.22)',
                }}
              >
                {count} styles
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 md:p-5">
              <h3 className="font-serif font-light text-[1.15rem] md:text-[1.35rem] leading-tight text-blush">
                {label}
              </h3>
              <p className="font-sans text-[0.72rem] font-light mt-0.5 line-clamp-1" style={{ color: 'rgba(237,233,228,0.7)' }}>
                {sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
