import type { Product, ProductCategory, SupportLevel } from '@/types'
import { searchCatalog } from '@/lib/catalogSearch'
import { ITEMS_PER_PAGE } from '@/lib/products'

export const SHOP_CATS: ProductCategory[] = [
  'everyday',
  'pushup',
  'lace',
  'sports',
  'seamless',
  'plus',
  'bridal',
]

export const SHOP_SUPPORT: SupportLevel[] = ['Light', 'Medium', 'High']

export interface ShopQuery {
  cat?: string
  support?: string
  sort?: string
  q?: string
  page: number
}

const EMPTY: ShopQuery = { page: 1 }

export function emptyShopQuery(): ShopQuery {
  return EMPTY
}

export function parseShopQuery(sp: { get(key: string): string | null }): ShopQuery {
  const rawPage = Number(sp.get('page') ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const cat = sp.get('cat') ?? undefined
  const support = sp.get('support') ?? undefined
  const sort = sp.get('sort') ?? undefined
  const q = sp.get('q')?.trim() || undefined
  return { cat, support, sort, q, page }
}

export function parseShopSearchParams(
  sp: Record<string, string | string[] | undefined>
): ShopQuery {
  return parseShopQuery({
    get(key) {
      const value = sp[key]
      if (Array.isArray(value)) return value[0] ?? null
      return value ?? null
    },
  })
}

type ShopHrefPatch = Partial<{
  cat: string
  support: string
  sort: string
  q: string
  page: number
}>

/** Build a /shop URL. Filter patches reset page unless `page` is also set. */
export function shopHref(query: ShopQuery, patch: ShopHrefPatch = {}): string {
  const filterChanged = ['cat', 'support', 'sort', 'q'].some((key) => key in patch)
  const next: ShopQuery = {
    cat: 'cat' in patch ? patch.cat || undefined : query.cat,
    support: 'support' in patch ? patch.support || undefined : query.support,
    sort: 'sort' in patch ? patch.sort || undefined : query.sort,
    q: 'q' in patch ? patch.q || undefined : query.q,
    page: 'page' in patch ? Math.max(1, patch.page ?? 1) : filterChanged ? 1 : query.page,
  }

  const params = new URLSearchParams()
  if (next.cat) params.set('cat', next.cat)
  if (next.support) params.set('support', next.support)
  if (next.sort) params.set('sort', next.sort)
  if (next.q) params.set('q', next.q)
  if (next.page > 1) params.set('page', String(next.page))
  const qs = params.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

export function filterShopCatalog(catalog: Product[], query: ShopQuery): Product[] {
  let list = catalog

  if (query.cat && SHOP_CATS.includes(query.cat as ProductCategory)) {
    list = list.filter((p) => p.cat === query.cat)
  }
  if (query.support && SHOP_SUPPORT.includes(query.support as SupportLevel)) {
    list = list.filter((p) => p.support === query.support)
  }
  if (query.q) {
    list = searchCatalog(query.q, list)
  }

  const sort = query.sort ?? ''
  if (sort === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating || a.id - b.id)
  } else if (sort === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price || a.id - b.id)
  } else if (sort === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price || a.id - b.id)
  } else if (sort === 'new') {
    list = [...list.filter((p) => p.badge === 'New'), ...list.filter((p) => p.badge !== 'New')]
  }

  return list
}

export function paginateShop(list: Product[], page: number, perPage = ITEMS_PER_PAGE) {
  const total = list.length
  const totalPages = Math.ceil(total / perPage)
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  return {
    data: list.slice(start, start + perPage),
    total,
    page: safePage,
    totalPages,
  }
}
