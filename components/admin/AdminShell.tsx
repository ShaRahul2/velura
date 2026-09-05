'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Package, LogOut, ClipboardList, LayoutDashboard, Users, Tags, MessageSquare, Mail, ArrowUpRight } from 'lucide-react'
const NAV = [
 { href: '/admin', label: 'Overview', icon: LayoutDashboard },
 { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
 { href: '/admin/products', label: 'Products', icon: Package },
 { href: '/admin/categories', label: 'Categories', icon: Tags },
 { href: '/admin/customers', label: 'Customers', icon: Users },
 { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
 { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
]
export default function AdminShell({ children }: { children: React.ReactNode }) {
 const pathname = usePathname()
 if (pathname === '/admin/login') return <>{children}</>
 return <div className="admin-shell min-h-screen bg-[#141210] text-[#EDE9E4] md:flex">
 <a href="#admin-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-black focus:p-4">Skip to content</a>
 <aside className="border-b border-[#413830] bg-[#0F0D0B] md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-r md:flex md:flex-col">
 <Link href="/admin" className="block px-6 py-7 text-sm tracking-[0.25em]">VELURA<span className="mt-2 block text-[10px] tracking-[0.15em] text-[#B8A898]">ADMINISTRATION</span></Link>
 <nav aria-label="Administration" className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-1 md:flex-col">{NAV.map(({href,label,icon:Icon}) => { const active = href === '/admin' ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded px-3 text-sm ${active ? 'bg-[#2D2722] text-[#EDE9E4]' : 'text-[#B8A898] hover:bg-[#211C18]'}`}><Icon size={16} aria-hidden="true" />{label}</Link> })}</nav>
 <div className="flex gap-2 border-t border-[#413830] p-3 md:flex-col"><Link href="/" className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#B8A898]"><ArrowUpRight size={16} />View store</Link><button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex min-h-11 items-center gap-3 px-3 text-sm text-[#B8A898]"><LogOut size={16} />Sign out</button></div>
 </aside><main id="admin-content" className="min-w-0 flex-1">{children}</main></div>
}
