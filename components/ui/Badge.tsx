import type { BadgeType } from '@/types'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children?: React.ReactNode
  type?: BadgeType
  className?: string
}

const colorMap: Record<NonNullable<BadgeType>, string> = {
  Bestseller:    'bg-mauve text-blush',
  New:           'bg-mauve text-blush',
  Sale:          'bg-gold text-blush',
  Premium:       'bg-deep text-blush',
  'Comfort Fit': 'bg-lm text-deep',
}

export function Badge({ children, type = null, className }: BadgeProps) {
  const color = type ? colorMap[type] : 'bg-lm text-deep'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-badge px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.1em] uppercase',
        color,
        className
      )}
    >
      {children ?? type}
    </span>
  )
}
