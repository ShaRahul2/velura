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
    <span aria-label={`${count} stars`}>
      {'★'.repeat(count)}
    </span>
  )
}

export function Testimonials() {
  return (
    <section className="py-20 px-6 md:px-10 bg-blush/40">
      <div className="max-w-6xl xl:max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-sans text-[0.68rem] lg:text-[0.72rem] tracking-label uppercase text-rose mb-3">
            Reviews
          </p>
          <h2
            className="font-serif font-light text-deep"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)', letterSpacing: '-0.01em' }}
          >
            Worn once. Remembered forever.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {REVIEWS.map(({ id, quote, author, location, product, rating }) => (
            <div
              key={id}
              className="flex flex-col gap-5 bg-cream p-7 lg:p-8 rounded-card shadow-card"
            >
              <p
                className="font-sans text-[0.68rem] tracking-[0.1em]"
                style={{ color: '#9A8878' }}
              >
                <Stars count={rating} />
              </p>
              <p className="font-serif text-[1.08rem] lg:text-[1.2rem] font-light italic text-deep leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-auto pt-4 border-t border-lm flex items-center justify-between">
                <div>
                  <p className="font-sans text-[0.78rem] lg:text-[0.84rem] font-medium text-deep">{author}</p>
                  <p className="font-sans text-[0.68rem] lg:text-[0.74rem] text-mauve">{location}</p>
                </div>
                <p className="font-sans text-[0.65rem] tracking-label uppercase text-rose">
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
