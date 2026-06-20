'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useEffect } from 'react'

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/shop',    label: 'Collections' },
  { href: '/builder', label: '✦ Custom Bra' },
]

export function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu } = useUiStore()

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  if (!mobileMenuOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(15,13,11,0.97)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[rgba(184,168,152,0.18)]">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="font-serif text-[1.1rem] lg:text-[1.2rem] tracking-logo"
          style={{ color: '#EDE9E4' }}
        >
          VELURA
        </Link>
        <button
          onClick={closeMobileMenu}
          className="p-2"
          style={{ color: 'rgba(237,233,228,0.55)' }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col px-6 py-8 gap-1">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={closeMobileMenu}
            className="py-4 font-sans text-[0.92rem] lg:text-[1rem] tracking-[0.12em] uppercase border-b border-[rgba(184,168,152,0.12)] transition-colors"
            style={{ color: 'rgba(237,233,228,0.55)' }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="mt-auto px-6 pb-12">
        <Link
          href="/builder"
          onClick={closeMobileMenu}
          className="block w-full text-center py-3.5 rounded-btn font-sans text-[0.8rem] lg:text-[0.86rem] tracking-btn uppercase transition-all"
          style={{ background: '#B8A898', color: '#0F0D0B' }}
        >
          Build Yours
        </Link>
      </div>
    </div>
  )
}
