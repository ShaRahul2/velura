import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('rounded-card', className)}
      style={{
        background: 'linear-gradient(90deg, #EDE9E4 25%, #D8D4CE 50%, #EDE9E4 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.6s infinite',
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="flex flex-col gap-2 px-0.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
