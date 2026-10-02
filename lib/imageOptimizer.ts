const BYPASS_HOSTS = new Set([
  'images.unsplash.com',
  'picsum.photos',
  'image.pollinations.ai',
])

/** Unsplash and similar CDNs reject the Next.js optimizer user-agent. */
export function shouldBypassImageOptimizer(src: string): boolean {
  if (!src || src.startsWith('/') || src.startsWith('data:')) return false
  try {
    const host = new URL(src).hostname
    return [...BYPASS_HOSTS].some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}
