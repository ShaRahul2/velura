'use client'

import { useSearchParams, useRouter } from 'next/navigation'

const SUPPORT = ['Light', 'Medium', 'High']

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
    <aside className="hidden w-32 shrink-0 md:block lg:w-36">
      <div>
        <p className="font-sans text-[0.68rem] tracking-label uppercase text-rose mb-4">
          Support
        </p>
        <ul className="flex flex-col">
          {SUPPORT.map((level) => {
            const active = activeSupport === level
            return (
              <li key={level}>
                <button
                  onClick={() => setParam('support', active ? '' : level)}
                  className="w-full text-left font-sans text-[0.84rem] py-1.5 pl-3 -ml-3 border-l-2 transition-colors"
                  style={{
                    color: active ? '#0F0D0B' : '#6B6058',
                    fontWeight: active ? 500 : 300,
                    borderColor: active ? '#0F0D0B' : 'transparent',
                  }}
                >
                  {level}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
