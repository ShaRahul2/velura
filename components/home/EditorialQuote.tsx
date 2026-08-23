import Image from 'next/image'
import Link from 'next/link'
import { pageWrap } from '@/lib/utils'

export function EditorialQuote() {
  return (
    <section className="py-16 md:py-24 bg-blush/40">
      <div className={`${pageWrap} grid md:grid-cols-2 gap-8 md:gap-14 items-center`}>
        <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-blush">
          <Image
            src="/images/lookbook/02.jpg"
            alt="Black lace, photographed in pearl light"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-lg md:py-8">
          <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-6">
            Worn once. Remembered forever.
          </p>
          <blockquote
            className="font-serif font-light italic text-deep leading-[1.25] mb-8"
            style={{ fontSize: 'clamp(1.55rem, 3.2vw, 2.45rem)', letterSpacing: '-0.02em' }}
          >
            “I forgot I was wearing it. That&apos;s exactly what I needed.”
          </blockquote>
          <p className="font-sans text-[0.82rem] text-deep">Priya M.</p>
          <p className="font-sans text-[0.75rem] text-mauve mb-8">Mumbai · FeatherSoft</p>
          <Link
            href="/shop"
            className="font-sans text-[0.78rem] tracking-btn uppercase text-deep underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Read the collection
          </Link>
        </div>
      </div>
    </section>
  )
}
