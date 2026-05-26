'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages:  number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) params.delete('page')
    else params.set('page', String(page))
    const qs = params.toString()
    router.push(qs ? `/shop?${qs}` : '/shop')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Build a window of page numbers: always show first, last, and 3 around current
  const pages: (number | '…')[] = []
  const range = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]
    .filter((n) => n >= 1 && n <= totalPages))
  let prev = 0
  Array.from(range).sort((a, b) => a - b).forEach((n) => {
    if (n - prev > 1) pages.push('…')
    pages.push(n)
    prev = n
  })

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      {/* Prev */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center text-mauve disabled:opacity-30 hover:text-deep transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center font-sans text-[0.78rem] text-mauve">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className="w-8 h-8 flex items-center justify-center font-sans text-[0.78rem] transition-colors"
            style={{
              color:      p === currentPage ? '#0F0D0B' : '#6B6058',
              fontWeight: p === currentPage ? 500 : 300,
              borderBottom: p === currentPage ? '1px solid #0F0D0B' : 'none',
            }}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center text-mauve disabled:opacity-30 hover:text-deep transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}
