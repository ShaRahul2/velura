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
    span: 'col-span-2 min-h-[200px] md:min-h-0',
  },
  {
    id: 'pushup',
    label: 'Push-Up',
    sub: 'Shape, then forgotten.',
    image: '/images/categories/pushup.jpg',
    span: 'col-span-2 min-h-[200px] md:min-h-0',
  },
]

export function CategoryGrid() {
  return (
    <section className={`bg-cream pb-20 md:pb-28 ${pageWrap}`}>
      <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="max-w-2xl">
          <p className="mb-3 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            Collections
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)', letterSpacing: '-0.01em' }}
          >
            Every shape has its own architecture.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden font-sans text-[0.78rem] tracking-btn uppercase text-mauve underline underline-offset-4 transition-colors hover:text-deep md:block"
        >
          View all
        </Link>
      </div>

      <div className="grid auto-rows-[200px] grid-cols-2 gap-2 md:auto-rows-[240px] md:grid-cols-4 md:gap-3 lg:auto-rows-[280px]">
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
              style={{
                background:
                  'linear-gradient(to top, rgba(15,13,11,0.58) 0%, rgba(15,13,11,0.08) 55%, rgba(15,13,11,0.00) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <h3 className="font-serif text-[1.25rem] font-light leading-tight text-blush md:text-[1.5rem]">
                {label}
              </h3>
              <p className="mt-0.5 line-clamp-1 font-sans text-[0.72rem] font-light text-blush/70">
                {sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
