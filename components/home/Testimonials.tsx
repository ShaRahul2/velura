import { pageWrap } from '@/lib/utils'

const REVIEWS = [
  {
    id: 1,
    quote: "I forgot I was wearing it. That's exactly what I needed.",
    author: 'Priya M.',
    location: 'Mumbai',
    product: 'FeatherSoft',
    rating: 5,
  },
  {
    id: 2,
    quote: "Finally a size 44DD that doesn't look like an afterthought.",
    author: 'Deepa R.',
    location: 'Bengaluru',
    product: 'CurveLove',
    rating: 5,
  },
  {
    id: 3,
    quote: 'The custom builder took twenty minutes. The result felt like it was made for me.',
    author: 'Ananya S.',
    location: 'Delhi',
    product: 'Custom Build',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} stars`} style={{ color: '#9A8878', letterSpacing: '0.12em' }}>
      {'★'.repeat(count)}
    </span>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-blush/50">
      <div className={pageWrap}>
        <div className="mb-10 md:mb-14 text-center">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-3">
            Reviews
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.1rem)', letterSpacing: '-0.01em' }}
          >
            Worn once. Remembered forever.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {REVIEWS.map(({ id, quote, author, location, product, rating }) => (
            <div
              key={id}
              className="flex flex-col gap-5 bg-cream p-7 md:p-8 rounded-card shadow-card"
            >
              <p className="font-sans text-[0.72rem]">
                <Stars count={rating} />
              </p>
              <p className="font-serif text-[1.15rem] md:text-[1.22rem] font-light italic text-deep leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-auto pt-4 border-t border-lm flex items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-[0.8rem] font-medium text-deep">{author}</p>
                  <p className="font-sans text-[0.7rem] text-mauve">{location}</p>
                </div>
                <p className="font-sans text-[0.62rem] tracking-label uppercase text-rose shrink-0">
                  {product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
