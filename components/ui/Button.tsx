'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark' | 'rose' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'dark',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-btn font-sans font-normal tracking-btn uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes: Record<string, string> = {
    sm: 'h-8 px-4 text-[0.72rem]',
    md: 'h-10 px-5 text-[0.8rem]',
    lg: 'h-12 px-7 text-[0.8rem]',
  }

  const variants: Record<string, string> = {
    dark:    'bg-deep text-blush hover:tracking-wide',
    rose:    'bg-rose text-deep font-medium hover:tracking-wide',
    outline: 'bg-transparent border border-deep text-deep hover:bg-deep hover:text-blush hover:tracking-wide',
  }

  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
