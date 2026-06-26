import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/types/product'
import { buildFilterMeta, type FilterParams } from '@/lib/filters'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  const filters: FilterParams = {
    q: sp.get('q') || undefined,
    category: sp.get('category') || undefined,
    brand: sp.get('brand') || undefined,
    min: sp.get('min') || undefined,
    max: sp.get('max') || undefined,
    rating: sp.get('rating') || undefined,
  }

  try {
    const products = await getAllProducts()
    const meta = buildFilterMeta(products, filters)
    return NextResponse.json(meta)
  } catch {
    return NextResponse.json(
      {
        categories: [],
        brands: [],
        catalogPriceRange: { min: 0, max: 0 },
        priceRange: { min: 0, max: 0 },
        totalProducts: 0,
      },
      { status: 500 },
    )
  }
}
