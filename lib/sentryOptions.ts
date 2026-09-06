/** Shared Sentry init options. Kept tiny and dependency-free so it can be
 *  imported from server, edge, and client init without pulling extra code. */
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || ''

export const sentryEnabled = SENTRY_DSN.length > 0

export const baseSentryOptions = {
  dsn: SENTRY_DSN,
  enabled: sentryEnabled,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  // Sample lightly by default; override with SENTRY_TRACES_SAMPLE_RATE.
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
}
