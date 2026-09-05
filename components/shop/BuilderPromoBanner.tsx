import Link from 'next/link'
import Image from 'next/image'

export function BuilderPromoBanner() {
  return (
    <div className="relative my-12 flex min-h-[200px] items-stretch overflow-hidden md:min-h-[240px]">
      <div className="absolute inset-0">
        <Image
          src="/images/categories/lace.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-deep/62" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-start justify-between gap-5 px-6 py-8 sm:flex-row sm:items-center md:px-10">
        <div>
          <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            ✦ Custom Bra
          </p>
          <p className="font-serif text-[1.4rem] font-light leading-snug text-blush md:text-[1.7rem]">
            Your size. Your fabric. Your fit.
          </p>
        </div>
        <Link
          href="/builder"
          className="pressable pressable-track inline-flex h-11 shrink-0 items-center rounded-btn bg-rose px-7 font-sans text-[0.78rem] tracking-btn uppercase text-deep"
        >
          Build Yours
        </Link>
      </div>
    </div>
  )
}
