import * as Sentry from '@sentry/nextjs'
import { baseSentryOptions, sentryEnabled } from '@/lib/sentryOptions'

if (sentryEnabled) {
  Sentry.init({
    ...baseSentryOptions,
    // Replays only on error, and only when a DSN is configured.
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
