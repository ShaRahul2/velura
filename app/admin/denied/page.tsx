import Link from 'next/link'

export default function AdminDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0D0B] px-6 text-center">
      <p className="mb-3 font-sans text-[0.65rem] tracking-[0.18em] uppercase text-[#B8A898]">403</p>
      <h1 className="mb-4 font-serif text-[2rem] font-light text-[#EDE9E4]">Not for this account.</h1>
      <p className="mb-8 max-w-sm font-sans text-[0.88rem] font-light text-[rgba(237,233,228,0.55)]">
        Administration is limited to managers and admins.
      </p>
      <Link href="/" className="font-sans text-[0.8rem] uppercase tracking-[0.12em] text-[#EDE9E4] underline underline-offset-4">
        Return to the store
      </Link>
    </div>
  )
}
