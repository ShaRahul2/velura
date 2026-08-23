import type { MetadataRoute } from 'next'
import { getAllProductIds } from '@/lib/products'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  let ids: number[] = []
  try {
    ids = await getAllProductIds()
  } catch {
    ids = Array.from({ length: 42 }, (_, i) => i + 1)
  }

  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/builder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const products: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${base}/shop/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...products]
}
