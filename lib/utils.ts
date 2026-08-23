import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Shared page container — keeps type and product grids from stretching too wide. */
export const pageWrap =
  'mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12 xl:max-w-[1360px] xl:px-16'

export function firstSizeFromRange(range: string): string {
  const start = range.split('–')[0]?.trim()
  return start && start !== 'M' ? start : '32B'
}
