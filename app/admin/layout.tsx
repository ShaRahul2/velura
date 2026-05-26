'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Package, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin/products', label: 'Products', icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#0F0D0B]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-[rgba(184,168,152,0.12)] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[rgba(184,168,152,0.12)]">
          <Link href="/admin/products">
            <span
              className="text-[#EDE9E4] text-sm font-sans tracking-[0.22em] uppercase"
              style={{ letterSpacing: '0.22em' }}
            >
              VELURA
            </span>
            <span className="block text-[#B8A898] text-[0.6rem] tracking-[0.14em] uppercase mt-0.5">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-[3px] text-[0.78rem] tracking-[0.06em] transition-colors',
                  active
                    ? 'bg-[rgba(237,233,228,0.08)] text-[#EDE9E4]'
                    : 'text-[rgba(237,233,228,0.45)] hover:text-[rgba(237,233,228,0.75)] hover:bg-[rgba(237,233,228,0.04)]',
                ].join(' ')}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-[rgba(184,168,152,0.12)]">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-[3px] text-[0.75rem] text-[rgba(237,233,228,0.35)] hover:text-[rgba(237,233,228,0.6)] transition-colors tracking-[0.06em]"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#141210]">
        {children}
      </main>
    </div>
  )
}
