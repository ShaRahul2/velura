export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  if (explicit && !/localhost|127\.0\.0\.1/.test(explicit)) return explicit

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercelProd) return `https://${vercelProd.replace(/^https?:\/\//, '')}`

  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`

  return explicit ?? 'http://localhost:3000'
}
