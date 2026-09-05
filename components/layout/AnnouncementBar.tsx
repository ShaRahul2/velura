import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <div className="flex h-8 items-center justify-center border-b border-nav-border bg-deep px-4">
      <p className="truncate font-sans text-[0.62rem] tracking-[0.14em] uppercase text-blush/72 md:text-[0.68rem]">
        Free shipping above ₹999
        <span className="mx-2.5 opacity-30" aria-hidden="true">
          ·
        </span>
        15-day returns
        <span className="mx-2.5 hidden opacity-30 sm:inline" aria-hidden="true">
          ·
        </span>
        <Link
          href="/builder"
          className="hidden text-rose underline underline-offset-4 decoration-white/20 hover:decoration-white/50 sm:inline"
        >
          Build Yours
        </Link>
      </p>
    </div>
  )
}
