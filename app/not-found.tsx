import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-[0.68rem] lg:text-[0.74rem] tracking-label uppercase text-rose mb-5">404</p>
      <h1
        className="font-serif font-light text-deep mb-4"
        style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', letterSpacing: '-0.01em' }}
      >
        This page doesn&apos;t exist.
      </h1>
      <p className="font-sans text-[0.9rem] lg:text-[1rem] font-light text-mauve mb-10">
        The link may have moved, or the address was typed incorrectly.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-8 font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase bg-deep text-blush hover:tracking-wide transition-all"
          style={{ borderRadius: 3 }}
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center h-11 px-8 font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase border border-deep text-deep hover:bg-deep hover:text-blush transition-all"
          style={{ borderRadius: 3 }}
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}
