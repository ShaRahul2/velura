const FALLBACK = '/admin'
export function safeAdminCallback(raw: string | null | undefined): string {
  if (!raw || /[\\\r\n]/.test(raw)) return FALLBACK
  try {
    const url = new URL(raw, 'https://admin.invalid')
    if (url.pathname === '/admin/login') return FALLBACK
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return `${url.pathname}${url.search}`
  } catch { /* use dashboard */ }
  return FALLBACK
}
export function requestOrigin(req: { headers: Headers; nextUrl: URL }): string {
  return req.nextUrl.origin
}
