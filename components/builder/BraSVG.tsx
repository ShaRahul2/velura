'use client'

interface BraSVGProps {
  braType: string | null
  color: string | null
  fabric: string | null
  padding: string | null
  strapStyle: string | null
}

const COLOR_MAP: Record<string, string> = {
  rose:  '#B8A898',
  cream: '#EDE9E4',
  deep:  '#0F0D0B',
  blush: '#F8F6F3',
  mauve: '#6B6058',
  black: '#181818',
  nude:  '#C9B4A0',
  ivory: '#F5EFE6',
  smoke: '#9A8878',
  slate: '#5A5550',
}

const STROKE_MAP: Record<string, string> = {
  deep:  '#EDE9E4',
  black: '#9A8878',
  slate: '#EDE9E4',
  mauve: '#EDE9E4',
}

export function BraSVG({ braType, color, strapStyle }: BraSVGProps) {
  const fill   = color ? (COLOR_MAP[color] ?? '#EDE9E4') : '#EDE9E4'
  const stroke = STROKE_MAP[color ?? ''] ?? '#6B6058'
  const isCross = strapStyle === 'crossback'
  const isWide  = strapStyle === 'wide'
  const isStrapless = braType === 'strapless'

  const cupDepth = braType === 'padded' ? 52 : braType === 'balconette' ? 42 : 48
  const cupTop   = braType === 'balconette' ? 58 : braType === 'sports' ? 52 : 62

  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left cup */}
      <path
        d={`M 100 90 C 85 90 60 85 50 ${cupTop} C 42 ${cupTop - 10} 40 ${cupTop - 30} 55 ${cupTop - cupDepth} C 65 ${cupTop - cupDepth - 8} 80 ${cupTop - cupDepth - 4} 100 90 Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Right cup */}
      <path
        d={`M 100 90 C 115 90 140 85 150 ${cupTop} C 158 ${cupTop - 10} 160 ${cupTop - 30} 145 ${cupTop - cupDepth} C 135 ${cupTop - cupDepth - 8} 120 ${cupTop - cupDepth - 4} 100 90 Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Band */}
      <path
        d="M 50 90 Q 75 96 100 96 Q 125 96 150 90 L 148 100 Q 124 106 100 106 Q 76 106 52 100 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Centre gore */}
      <line x1="100" y1="76" x2="100" y2="90" stroke={stroke} strokeWidth="1" opacity="0.6" />

      {/* Straps */}
      {!isStrapless && !isCross && (
        <>
          <path
            d={`M ${isWide ? 72 : 82} ${cupTop - cupDepth + 4} L ${isWide ? 68 : 76} 20`}
            stroke={stroke}
            strokeWidth={isWide ? 7 : 2}
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d={`M ${isWide ? 128 : 118} ${cupTop - cupDepth + 4} L ${isWide ? 132 : 124} 20`}
            stroke={stroke}
            strokeWidth={isWide ? 7 : 2}
            strokeLinecap="round"
            opacity="0.8"
          />
        </>
      )}
      {!isStrapless && isCross && (
        <>
          <path d="M 82 20 L 126 18" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <path d="M 118 20 L 74 18" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx="100" cy="18" r="2" fill={stroke} opacity="0.7" />
        </>
      )}

      {/* Back closure dots */}
      <circle cx="50" cy="93" r="2" fill={stroke} opacity="0.5" />
      <circle cx="150" cy="93" r="2" fill={stroke} opacity="0.5" />

      {/* Lace overlay for lace type */}
      {braType === 'lace' && (
        <path
          d={`M 100 90 C 85 90 60 85 50 ${cupTop} C 42 ${cupTop - 10} 40 ${cupTop - 30} 55 ${cupTop - cupDepth} C 65 ${cupTop - cupDepth - 8} 80 ${cupTop - cupDepth - 4} 100 90 M 100 90 C 115 90 140 85 150 ${cupTop} C 158 ${cupTop - 10} 160 ${cupTop - 30} 145 ${cupTop - cupDepth} C 135 ${cupTop - cupDepth - 8} 120 ${cupTop - cupDepth - 4} 100 90 Z`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.5"
          strokeDasharray="3 2"
          opacity="0.5"
        />
      )}
    </svg>
  )
}
