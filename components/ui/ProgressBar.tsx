import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  label?: string
}

export function ProgressBar({ value, max = 100, className, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <p className="font-sans text-[0.72rem] text-mauve mb-1.5">{label}</p>
      )}
      <div className="h-1 w-full rounded-full overflow-hidden bg-lm">
        <div
          className="h-full bg-deep transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
