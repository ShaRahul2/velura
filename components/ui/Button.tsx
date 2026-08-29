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
    'pressable pressable-track inline-flex items-center justify-center rounded-btn font-sans font-normal tracking-btn uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

  const sizes: Record<string, string> = {
    sm: 'h-8 px-4 text-[0.72rem] lg:text-[0.76rem]',
    md: 'h-10 px-5 text-[0.8rem] lg:text-[0.86rem]',
    lg: 'h-12 px-7 text-[0.8rem] lg:text-[0.86rem]',
  }

  const variants: Record<string, string> = {
    dark:    'bg-deep text-blush',
    rose:    'bg-rose text-deep font-medium',
    outline: 'bg-transparent border border-deep text-deep hover:bg-deep hover:text-blush',
  }

  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}
