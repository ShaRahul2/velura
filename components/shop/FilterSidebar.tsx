'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const SUPPORT = ['Light', 'Medium', 'High'] as const

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSupport = searchParams.get('support') ?? ''

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') params.delete(key)
    else params.set(key, value)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `/shop?${qs}` : '/shop')
  }

  return (
    <aside className="hidden w-36 shrink-0 md:block lg:w-40">
      <p className="mb-4 font-sans text-[0.68rem] tracking-label uppercase text-rose">
        Support
      </p>
      <ul className="flex flex-col">
        <li>
          <button
            type="button"
            onClick={() => setParam('support', '')}
            className={cn(
              'w-full border-l-2 py-1.5 pl-3 -ml-3 text-left font-sans text-[0.84rem] transition-colors',
              !activeSupport
                ? 'border-deep font-medium text-deep'
                : 'border-transparent font-light text-mauve hover:text-deep'
            )}
          >
            All
          </button>
        </li>
        {SUPPORT.map((level) => {
          const active = activeSupport === level
          return (
            <li key={level}>
              <button
                type="button"
                onClick={() => setParam('support', active ? '' : level)}
                className={cn(
                  'w-full border-l-2 py-1.5 pl-3 -ml-3 text-left font-sans text-[0.84rem] transition-colors',
                  active
                    ? 'border-deep font-medium text-deep'
                    : 'border-transparent font-light text-mauve hover:text-deep'
                )}
              >
                {level}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
