import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'
import type { ProductCategory } from '@/types'

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const cat     = searchParams.get('cat') as ProductCategory | null
  const sort    = searchParams.get('sort') ?? ''
  const page    = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit   = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 12)))

  let result = [...products]

  if (cat) result = result.filter((p) => p.cat === cat)

  switch (sort) {
    case 'rating':     result.sort((a, b) => b.rating - a.rating);      break
    case 'price-asc':  result.sort((a, b) => a.price - b.price);        break
    case 'price-desc': result.sort((a, b) => b.price - a.price);        break
    case 'new':
      result = result
        .filter((p) => p.badge === 'New')
        .concat(result.filter((p) => p.badge !== 'New'))
      break
  }

  const total  = result.length
  const start  = (page - 1) * limit
  const paged  = result.slice(start, start + limit)

  return NextResponse.json({ data: paged, total, page })
}
