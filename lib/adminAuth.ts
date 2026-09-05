const FALLBACK = '/admin/products'

/** Only same-origin /admin paths — never localhost or an external URL. */
export function safeAdminCallback(raw: string | null | undefined): string {
  if (!raw) return FALLBACK
  const value = raw.trim()
  if (value.startsWith('/') && !value.startsWith('//') && value.startsWith('/admin')) {
    return value
  }
  try {
    const url = new URL(value)
    if (url.pathname.startsWith('/admin')) {
      return `${url.pathname}${url.search}`
    }
  } catch {
    /* ignore */
  }
  return FALLBACK
}

export function requestOrigin(req: { headers: Headers; nextUrl: URL }): string {
  const hostHeader = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? req.nextUrl.host
  const host = hostHeader.split(',')[0]?.trim() || req.nextUrl.host
  const protoHeader = req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '')
  const proto = protoHeader.split(',')[0]?.trim() || 'https'
  return `${proto}://${host}`
}
