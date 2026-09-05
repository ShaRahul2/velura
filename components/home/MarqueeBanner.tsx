const ITEMS = [
  'Crafted for every body',
  '26AA – 52K',
  'Free shipping above ₹999',
  'XS – 4XL',
  '15-day easy returns',
  'Invisible under anything',
  'Made in India',
]

export function MarqueeBanner() {
  const loop = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden border-y border-nav-border bg-deep py-3.5">
      <div
        className="flex w-max whitespace-nowrap"
        style={{ animation: 'marquee 32s linear infinite' }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="px-7 font-sans text-[0.68rem] tracking-label uppercase text-blush"
          >
            {item}
            <span className="ml-7 text-rose/50" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
