import Link from 'next/link'
import { cn } from '@/lib/utils'
import { shopHref, type ShopQuery } from '@/lib/shopQuery'

const SUPPORT = ['Light', 'Medium', 'High'] as const

export function FilterSidebar({ query }: { query: ShopQuery }) {
  const activeSupport = query.support ?? ''

  return (
    <aside className="hidden w-36 shrink-0 md:block lg:w-44">
      <p className="mb-4 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Support
      </p>
      <ul className="flex flex-col">
        <li>
          <Link
            href={shopHref(query, { support: '' })}
            scroll={false}
            prefetch
            className={cn(
              'block w-full border-l-2 py-1.5 pl-3 -ml-3 text-left font-sans text-[0.84rem] transition-colors',
              !activeSupport
                ? 'border-deep font-medium text-deep'
                : 'border-transparent font-light text-mauve hover:text-deep'
            )}
          >
            All
          </Link>
        </li>
        {SUPPORT.map((level) => {
          const active = activeSupport === level
          return (
            <li key={level}>
              <Link
                href={shopHref(query, { support: active ? '' : level })}
                scroll={false}
                prefetch
                className={cn(
                  'block w-full border-l-2 py-1.5 pl-3 -ml-3 text-left font-sans text-[0.84rem] transition-colors',
                  active
                    ? 'border-deep font-medium text-deep'
                    : 'border-transparent font-light text-mauve hover:text-deep'
                )}
              >
                {level}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
