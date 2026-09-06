'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// Catches errors thrown in the root layout itself, where app/error.tsx cannot
// render. Must ship its own <html>/<body>.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[global error]', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          background: '#F8F6F3',
          color: '#0F0D0B',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#B8A898',
            marginBottom: '1.25rem',
          }}
        >
          Something went wrong
        </p>
        <h1 style={{ fontWeight: 300, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: '0 0 1.5rem' }}>
          The page failed to load.
        </h1>
        <button
          onClick={reset}
          style={{
            height: 44,
            padding: '0 2rem',
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: '#0F0D0B',
            color: '#EDE9E4',
            border: 'none',
            borderRadius: 3,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
