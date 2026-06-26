import { NextRequest, NextResponse } from 'next/server'
import { getSearchSuggestions } from '@/lib/api/products'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''

  if (q.trim().length < 2) {
    return NextResponse.json([])
  }

  try {
    const suggestions = await getSearchSuggestions(q, 6)
    return NextResponse.json(suggestions)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
