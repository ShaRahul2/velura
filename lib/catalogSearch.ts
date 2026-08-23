import { products as catalog } from '@/data/products'
import { colorLabel } from '@/lib/colorways'
import type { Product } from '@/types'

export interface SearchHit {
  id: number
  name: string
  story: string
  price: number
  image: string
  cat: Product['cat']
  support: Product['support']
}

export function toSearchHit(product: Product): SearchHit {
  return {
    id: product.id,
    name: product.name,
    story: product.story,
    price: product.price,
    image: product.images[0] ?? '',
    cat: product.cat,
    support: product.support,
  }
}

function haystack(product: Product): string {
  const colors = (product.colorways ?? []).map(colorLabel).join(' ')
  return [
    product.name,
    product.story,
    product.sub,
    product.cat,
    product.fabric,
    product.support,
    product.sizes,
    colors,
  ]
    .join(' ')
    .toLowerCase()
}

export function searchCatalog(query: string, source: Product[] = catalog): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter((t) => t.length > 1)

  return source
    .map((product) => {
      const text = haystack(product)
      let score = 0
      if (product.name.toLowerCase().includes(q)) score += 12
      if (product.cat.toLowerCase() === q) score += 8
      for (const token of tokens) {
        if (product.name.toLowerCase().includes(token)) score += 4
        if (text.includes(token)) score += 2
      }
      return { product, score }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.product)
}

export function catalogDigest() {
  return catalog.map((p) => ({
    id: p.id,
    name: p.name,
    story: p.story,
    cat: p.cat,
    price: p.price,
    support: p.support,
    fabric: p.fabric,
    sizes: p.sizes,
    colours: (p.colorways ?? []).map(colorLabel),
  }))
}
