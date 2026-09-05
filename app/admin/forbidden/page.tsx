import Link from 'next/link'

export default function AdminForbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0D0B] px-6 text-center">
      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#B8A898]">Administration</p>
      <h1 className="mb-4 font-serif text-[2rem] font-light text-[#EDE9E4]">You do not have access.</h1>
      <p className="mb-8 max-w-sm text-[0.88rem] text-[rgba(237,233,228,0.55)]">
        This desk is for managers and admins only.
      </p>
      <Link href="/" className="text-[0.78rem] uppercase tracking-[0.12em] text-[#EDE9E4] underline underline-offset-4">
        Return to the store
      </Link>
    </div>
  )
}
