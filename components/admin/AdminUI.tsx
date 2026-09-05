import Link from 'next/link'
export type AdminParams = Record<string, string | string[] | undefined>
export function param(params: AdminParams, key: string) { const v = params[key]; return typeof v === 'string' ? v.slice(0, 200) : '' }
export function pageNumber(params: AdminParams) { const n = Number(param(params, 'page')); return Number.isSafeInteger(n) && n > 0 ? Math.min(n, 100000) : 1 }
export function AdminHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="admin-eyebrow">VELURA / OPERATIONS</p><h1 className="mt-2 font-serif text-4xl">{title}</h1><p className="mt-2 text-sm text-[#B8A898]">{description}</p></div>{children}</header>
}
export function SearchForm({ q, children, placeholder = 'Search…' }: { q: string; children?: React.ReactNode; placeholder?: string }) {
  return <form className="mb-6 flex flex-wrap items-end gap-3"><label className="flex min-w-48 flex-1 flex-col gap-2 text-xs text-[#B8A898]">Search<input className="admin-input" name="q" defaultValue={q} placeholder={placeholder} /></label>{children}<button className="admin-button">Apply filters</button><Link className="admin-link py-3" href="?">Reset</Link></form>
}
export function Pagination({ page, total, params, size = 25 }: { page: number; total: number; params: AdminParams; size?: number }) {
 const pages = Math.max(1, Math.ceil(total / size)); const href = (n: number) => { const q = new URLSearchParams(); for (const [k,v] of Object.entries(params)) if (typeof v === 'string') q.set(k,v); q.set('page', String(n)); return `?${q}` }
 return <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4 text-sm text-[#B8A898]"><span>{total} results · Page {page} of {pages}</span><div className="flex gap-4">{page > 1 && <Link className="admin-link" href={href(page-1)}>Previous</Link>}{page < pages && <Link className="admin-link" href={href(page+1)}>Next</Link>}</div></nav>
}
export function Empty({ children }: { children: React.ReactNode }) { return <p className="rounded border border-[#413830] p-8 text-[#B8A898]">{children}</p> }
