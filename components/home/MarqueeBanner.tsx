const ITEMS = [
  'Crafted for every body',
  '26AA – 52K',
  'Free shipping above ₹999',
  'XS – 4XL',
  '15-day easy returns',
  'Invisible under anything',
  'Made in India',
  'Crafted for every body',
  '26AA – 52K',
  'Free shipping above ₹999',
  'XS – 4XL',
  '15-day easy returns',
  'Invisible under anything',
  'Made in India',
]

export function MarqueeBanner() {
  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{ background: '#0F0D0B', borderColor: 'rgba(184,168,152,0.14)' }}
    >
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {ITEMS.map((item, i) => (
          <span
            key={i}
            className="font-sans text-[0.68rem] lg:text-[0.72rem] tracking-label uppercase px-6"
            style={{ color: '#EDE9E4' }}
          >
            {item}
            <span className="ml-6 opacity-30">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
