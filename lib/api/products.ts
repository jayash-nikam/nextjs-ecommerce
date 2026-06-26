import { Product } from '@/types/product'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export const PAGE_SIZE = 8

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  min?: string
  max?: string
  rating?: string
  page?: string
  sort?: string
  limit?: string
}

export interface SearchSuggestion {
  id: number
  title: string
  brand: string
  category: string
  price: number
  image: string
}

interface PaginatedResponse {
  products: Product[]
  total: number
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse> {
  const query = new URLSearchParams()

  const search = filters.search?.trim()
  if (search) {
    query.append('q', search)
  }

  if (filters.category?.trim()) {
    query.append('category', filters.category.trim())
  }

  if (filters.brand?.trim()) {
    query.append('brand', filters.brand.trim())
  }

  if (filters.rating?.trim()) {
    query.append('rating_gte', filters.rating.trim())
  }

  if (filters.min?.trim()) {
    query.append('price_gte', filters.min.trim())
  }

  if (filters.max?.trim()) {
    query.append('price_lte', filters.max.trim())
  }

  if (filters.sort) {
    const lastUnderscore = filters.sort.lastIndexOf('_')
    const field = filters.sort.slice(0, lastUnderscore)
    const order = filters.sort.slice(lastUnderscore + 1)
    if (field && (order === 'asc' || order === 'desc')) {
      query.append('_sort', field)
      query.append('_order', order)
    }
  }

  const page = filters.page || '1'
  const limit = filters.limit || String(PAGE_SIZE)
  query.append('_page', page)
  query.append('_limit', limit)

  const url = `${BASE_URL}/products?${query.toString()}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  const total = Number(res.headers.get('X-Total-Count') || 0)
  const products: Product[] = await res.json()

  return { products, total }
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${Number(id)}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }

  return res.json()
}

export async function getSimilarProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const query = new URLSearchParams()
  query.append('category', product.category)
  query.append('id_ne', String(product.id))
  query.append('_sort', 'rating')
  query.append('_order', 'desc')
  query.append('_limit', String(limit))

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const query = new URLSearchParams()
  query.append('_sort', 'rating')
  query.append('_order', 'desc')
  query.append('_limit', String(limit))

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) return []
  return res.json()
}

export async function getSearchSuggestions(
  term: string,
  limit = 6,
): Promise<SearchSuggestion[]> {
  const q = term.trim()
  if (q.length < 2) return []

  const query = new URLSearchParams()
  query.append('q', q)
  query.append('_limit', String(limit))
  query.append('_sort', 'rating')
  query.append('_order', 'desc')

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) return []

  const products: Product[] = await res.json()

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: p.price,
    image: p.images[0] ?? '',
  }))
}
