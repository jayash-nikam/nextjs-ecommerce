import { NextRequest, NextResponse } from 'next/server'
import { getProducts, PAGE_SIZE } from '@/lib/api/products'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  try {
    const { products, total } = await getProducts({
      search: sp.get('q') || sp.get('search') || undefined,
      category: sp.get('category') || undefined,
      brand: sp.get('brand') || undefined,
      min: sp.get('min') || undefined,
      max: sp.get('max') || undefined,
      rating: sp.get('rating') || undefined,
      sort: sp.get('sort') || undefined,
      page: sp.get('page') || '1',
      limit: sp.get('limit') || String(PAGE_SIZE),
    })

    return NextResponse.json({ products, total, pageSize: PAGE_SIZE })
  } catch {
    return NextResponse.json(
      { products: [], total: 0, pageSize: PAGE_SIZE },
      { status: 500 },
    )
  }
}
