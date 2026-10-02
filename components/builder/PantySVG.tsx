'use client'

interface PantySVGProps {
  styleId: string
  color: string
}

/** Flat diagram of a panty cut. Fill follows the chosen dye. */
export function PantySVG({ styleId, color }: PantySVGProps) {
  const high = styleId === 'panty-highwaist'
  const bikini = styleId === 'panty-bikini'
  const lace = styleId === 'panty-lace'
  const waist = high ? 18 : bikini ? 58 : 36
  const hip = 118
  const leg = high ? 158 : bikini ? 148 : 152
  const side = bikini ? 28 : 22
  const fill = color || '#EDE9E4'
  const scallop = lace
    ? `M ${side} ${waist + 8} Q 40 ${waist - 2} 54 ${waist + 8} T 80 ${waist + 8} T 106 ${waist + 8} T ${160 - side} ${waist + 8}`
    : ''

  return (
    <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden="true">
      <path
        d={`
          M ${side} ${waist}
          Q 80 ${waist - (high ? 6 : 10)} ${160 - side} ${waist}
          L ${160 - (bikini ? 18 : 14)} ${hip}
          Q 132 ${leg} 108 ${leg - 6}
          Q 80 ${leg + 16} 52 ${leg - 6}
          Q 28 ${leg} ${bikini ? 18 : 14} ${hip}
          Z
        `}
        fill={fill}
        stroke="#0F0D0B"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d={`M ${side + 2} ${waist + 7} Q 80 ${waist + (high ? 2 : -2)} ${158 - side} ${waist + 7}`}
        fill="none"
        stroke="#0F0D0B"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      {scallop && (
        <path d={scallop} fill="none" stroke="#0F0D0B" strokeWidth="0.8" opacity="0.7" />
      )}
      <path
        d={`M 62 ${leg - 18} Q 80 ${leg - 4} 98 ${leg - 18}`}
        fill="none"
        stroke="#0F0D0B"
        strokeWidth="0.7"
        opacity="0.35"
      />
    </svg>
  )
}
