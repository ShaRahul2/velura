import * as Sentry from '@sentry/nextjs'
import { baseSentryOptions, sentryEnabled } from '@/lib/sentryOptions'

export async function register() {
  if (!sentryEnabled) return
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(baseSentryOptions)
  }
}

export const onRequestError = Sentry.captureRequestError
