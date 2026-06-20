import Link from 'next/link'
import { products } from '@/data/products'
import { formatPrice } from '@/lib/utils'

const SHOWCASE_IDS = [1, 4, 14] // FeatherSoft · Velvet Plunge · Ivory Bloom

export function HeroSection() {
  const showcase = products.filter((p) => SHOWCASE_IDS.includes(p.id))

  return (
    <section className="relative min-h-[92vh] flex flex-col md:flex-row overflow-hidden">
      {/* ── Left — editorial text ─────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 bg-cream z-10">
        <div style={{ animation: 'fadeUp 0.7s ease both' }}>
          <p
            className="font-sans text-[0.68rem] tracking-label uppercase mb-6"
            style={{ color: '#B8A898' }}
          >
            New Season · May 2025
          </p>

          <h1
            className="font-serif font-light leading-[1.06] mb-6"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
              letterSpacing: '-0.01em',
              color: '#0F0D0B',
            }}
          >
            Crafted for<br />
            the woman<br />
            who knows.
          </h1>

          <p className="font-sans text-[0.92rem] lg:text-[1rem] font-light text-mauve leading-relaxed mb-10 max-w-xs">
            Disappears under anything.<br />Remembered by your body.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all duration-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center h-12 px-8 rounded-btn font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all duration-200"
            >
              ✦ Build Yours
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex gap-8 mt-14 pt-8 border-t border-lm"
          style={{ animation: 'fadeUp 0.9s 0.15s ease both' }}
        >
          {[
            { value: '50,000+', label: 'Women' },
            { value: '26AA–52K', label: 'Size range' },
            { value: '4.8★', label: 'Avg. rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-[1.4rem] lg:text-[1.55rem] font-light text-deep">{value}</p>
              <p className="font-sans text-[0.65rem] lg:text-[0.7rem] tracking-label uppercase text-mauve mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right — product showcase ───────────────────── */}
      <div
        className="w-full md:w-[48%] min-h-[60vh] md:min-h-full relative flex items-center justify-center px-6 py-12 md:py-0"
        style={{ background: 'linear-gradient(160deg, #EDE9E4 0%, #D8D4CE 50%, #CCC6BE 100%)' }}
      >
        {/* Showcase grid */}
        <div
          className="w-full max-w-[340px] lg:max-w-[400px] 2xl:max-w-[440px] flex flex-col gap-3"
          style={{ animation: 'fadeUp 0.8s 0.1s ease both' }}
        >
          {/* Large card */}
          <Link href={`/shop/${showcase[0]?.id}`} className="group relative rounded-card overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <ProductHeroCard product={showcase[0]} size="lg" />
          </Link>

          {/* Two small cards */}
          <div className="grid grid-cols-2 gap-3">
            {showcase.slice(1).map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`} className="group relative rounded-card overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <ProductHeroCard product={product} size="sm" />
              </Link>
            ))}
          </div>
        </div>

        {/* Tag — top right */}
        <div
          className="absolute top-8 right-8 border px-3 py-1.5 rounded-[2px]"
          style={{
            borderColor: 'rgba(107,96,88,0.25)',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-sans text-[0.65rem] lg:text-[0.7rem] tracking-label uppercase text-mauve">
            26AA – 52K
          </p>
        </div>

        {/* Tag — bottom left */}
        <div
          className="absolute bottom-8 left-8 border px-3 py-1.5 rounded-[2px]"
          style={{
            borderColor: 'rgba(107,96,88,0.25)',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-sans text-[0.65rem] lg:text-[0.7rem] tracking-label uppercase text-mauve">
            From {formatPrice(499)}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Inline sub-component: card art ── */
import type { Product } from '@/types'

const CATEGORY_GRADIENTS: Record<string, { bg: string; accent: string }> = {
  everyday: { bg: 'linear-gradient(145deg,#F4F0EC 0%,#E8E2DC 100%)', accent: '#B8A898' },
  pushup:   { bg: 'linear-gradient(145deg,#1A1614 0%,#2E2420 100%)', accent: '#B8A898' },
  lace:     { bg: 'linear-gradient(145deg,#F8F4F0 0%,#EDE6DE 100%)', accent: '#9A8878' },
  sports:   { bg: 'linear-gradient(145deg,#2A2420 0%,#1A1410 100%)', accent: '#D8D4CE' },
  seamless: { bg: 'linear-gradient(145deg,#EDE9E4 0%,#DDD9D2 100%)', accent: '#9A8878' },
  plus:     { bg: 'linear-gradient(145deg,#F0EBE4 0%,#E0D8CE 100%)', accent: '#B8A898' },
  bridal:   { bg: 'linear-gradient(145deg,#FDFBF8 0%,#F2EDE6 100%)', accent: '#C4B8A8' },
}

function ProductHeroCard({
  product,
  size,
}: {
  product: Product | undefined
  size: 'lg' | 'sm'
}) {
  if (!product) return null
  const { bg, accent } = CATEGORY_GRADIENTS[product.cat] ?? CATEGORY_GRADIENTS.everyday
  const isDark = product.cat === 'pushup' || product.cat === 'sports'

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 transition-transform duration-300 group-hover:scale-[1.02]" style={{ background: bg }}>
      {/* Emoji centred */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className="select-none"
          style={{
            fontSize: size === 'lg' ? '3.8rem' : '2.4rem',
            filter: 'drop-shadow(0 4px 12px rgba(15,13,11,0.15))',
          }}
          aria-hidden="true"
        >
          {product.emoji}
        </span>
      </div>

      {/* Info bar */}
      <div>
        <p
          className="font-serif leading-tight"
          style={{
            fontSize: size === 'lg' ? '1.1rem' : '0.9rem',
            color: isDark ? '#EDE9E4' : '#0F0D0B',
          }}
        >
          {product.name}
        </p>
        <p
          className="font-sans text-[0.68rem] lg:text-[0.74rem] mt-0.5"
          style={{ color: isDark ? 'rgba(237,233,228,0.6)' : '#6B6058' }}
        >
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
        style={{ background: accent }}
      />
    </div>
  )
}
