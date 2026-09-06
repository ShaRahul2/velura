import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { shopHref, type ShopQuery } from '@/lib/shopQuery'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  query: ShopQuery
}

export function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let n = 1; n <= totalPages; n++) pages.push(n)
  } else {
    const range = new Set(
      [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
        (n) => n >= 1 && n <= totalPages
      )
    )
    let prev = 0
    Array.from(range)
      .sort((a, b) => a - b)
      .forEach((n) => {
        if (n - prev > 1) pages.push('…')
        pages.push(n)
        prev = n
      })
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
      {currentPage === 1 ? (
        <span className="flex h-9 w-9 items-center justify-center text-mauve opacity-30 lg:h-10 lg:w-10">
          <ChevronLeft size={18} aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={shopHref(query, { page: currentPage - 1 })}
          className="flex h-9 w-9 items-center justify-center text-mauve transition-colors hover:text-deep lg:h-10 lg:w-10"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </Link>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center font-sans text-[0.78rem] text-mauve lg:h-10 lg:w-10 lg:text-[0.85rem]"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={shopHref(query, { page: p })}
            className={cn(
              'flex h-9 w-9 items-center justify-center font-sans text-[0.78rem] transition-colors lg:h-10 lg:w-10 lg:text-[0.85rem]',
              p === currentPage
                ? 'border-b border-deep font-medium text-deep'
                : 'font-light text-mauve hover:text-deep'
            )}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage === totalPages ? (
        <span className="flex h-9 w-9 items-center justify-center text-mauve opacity-30 lg:h-10 lg:w-10">
          <ChevronRight size={18} aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={shopHref(query, { page: currentPage + 1 })}
          className="flex h-9 w-9 items-center justify-center text-mauve transition-colors hover:text-deep lg:h-10 lg:w-10"
          aria-label="Next page"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
