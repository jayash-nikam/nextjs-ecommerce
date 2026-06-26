import { Product } from '@/types/product'

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface FilterMeta {
  categories: FilterOption[]
  brands: FilterOption[]
  /** Full available range for the current filters (ignoring price selection) */
  catalogPriceRange: { min: number; max: number }
  priceRange: { min: number; max: number }
  totalProducts: number
}

export interface FilterParams {
  q?: string
  category?: string
  brand?: string
  min?: string
  max?: string
  rating?: string
}

function matchesSearch(product: Product, q: string): boolean {
  const term = q.toLowerCase()
  const haystack = [
    product.title,
    product.brand,
    product.description,
    product.category,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(term)
}

export function applyFilters(
  products: Product[],
  filters: FilterParams,
  exclude?: keyof FilterParams | 'price',
): Product[] {
  return products.filter((p) => {
    if (exclude !== 'q' && filters.q && !matchesSearch(p, filters.q)) return false
    if (exclude !== 'category' && filters.category && p.category !== filters.category)
      return false
    if (exclude !== 'brand' && filters.brand && p.brand !== filters.brand)
      return false
    if (exclude !== 'price') {
      if (filters.min && p.price < Number(filters.min)) return false
      if (filters.max && p.price > Number(filters.max)) return false
    }
    if (exclude !== 'rating' && filters.rating && p.rating < Number(filters.rating))
      return false
    return true
  })
}

function priceBounds(products: Product[]) {
  if (products.length === 0) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export function buildFilterMeta(
  allProducts: Product[],
  filters: FilterParams,
): FilterMeta {
  const matched = applyFilters(allProducts, filters)
  const forCatalogBounds = applyFilters(allProducts, filters, 'price')

  const categoryMap = new Map<string, number>()
  const brandMap = new Map<string, number>()

  applyFilters(allProducts, filters, 'category').forEach((p) => {
    categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1)
  })

  applyFilters(allProducts, filters, 'brand').forEach((p) => {
    brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1)
  })

  return {
    categories: Array.from(categoryMap.entries())
      .map(([value, count]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count),
    brands: Array.from(brandMap.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort((a, b) => b.count - a.count),
    catalogPriceRange: priceBounds(forCatalogBounds),
    priceRange: priceBounds(matched),
    totalProducts: matched.length,
  }
}
