import Link from 'next/link'
import Image from 'next/image'

export function BuilderPromoBanner({ garment = 'bra' }: { garment?: 'bra' | 'panties' }) {
  const panties = garment === 'panties'
  return (
    <div className="relative my-8 flex min-h-[160px] items-stretch overflow-hidden md:my-10 md:min-h-[180px]">
      <div className="absolute inset-0">
        <Image
          src={panties ? '/images/categories/panties.jpg' : '/images/categories/lace.jpg'}
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          quality={60}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-deep/62" />
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-start justify-between gap-5 px-6 py-8 sm:flex-row sm:items-center md:px-10">
        <div>
          <p className="mb-2 font-sans text-[0.68rem] tracking-label uppercase text-rose">
            {panties ? '✦ Custom Panties' : '✦ Custom Bra'}
          </p>
          <p className="font-serif text-[1.4rem] font-light leading-snug text-blush md:text-[1.7rem]">
            {panties ? 'Style. Fabric. Colour.' : 'Your size. Your fabric. Your fit.'}
          </p>
        </div>
        <Link
          href={panties ? '/builder?garment=panties' : '/builder'}
          className="pressable pressable-track inline-flex h-11 shrink-0 items-center rounded-btn bg-rose px-7 font-sans text-[0.78rem] tracking-btn uppercase text-deep"
        >
          Build Yours
        </Link>
      </div>
    </div>
  )
}
