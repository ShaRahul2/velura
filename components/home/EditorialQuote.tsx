import Image from 'next/image'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

export function EditorialQuote() {
  return (
    <section className="bg-blush py-20 md:py-28">
      <div className={`${pageWrap} grid items-center gap-10 md:grid-cols-2 md:gap-20`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-cream md:aspect-[3/4]">
          <Image
            src="/images/lookbook/02.jpg"
            alt="Black lace, photographed in pearl light"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-lg md:py-8">
          <p className="mb-6 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            From the fitting room
          </p>
          <blockquote
            className="mb-8 font-serif font-light italic leading-[1.18] text-deep"
            style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.7rem)', letterSpacing: '-0.01em' }}
          >
            “I forgot I was wearing it. That&apos;s exactly what I needed.”
          </blockquote>
          <p className="font-sans text-[0.82rem] text-deep">Priya M.</p>
          <p className="mb-10 font-sans text-[0.75rem] text-mauve">Mumbai · FeatherSoft</p>
          <Link
            href="/shop"
            className="font-sans text-[0.78rem] tracking-btn uppercase text-deep underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
