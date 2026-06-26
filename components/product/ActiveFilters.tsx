'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

const labelMap: Record<string, string> = {
  category: 'Category',
  brand: 'Brand',
  sort: 'Sort',
  min: 'Min Price',
  max: 'Max Price',
  q: 'Search',
  rating: 'Rating',
}

const sortLabels: Record<string, string> = {
  price_asc: 'Price: Low → High',
  price_desc: 'Price: High → Low',
  rating_desc: 'Rating: High → Low',
}

function formatValue(key: string, value: string): string {
  if (key === 'sort') return sortLabels[value] || value
  if (key === 'category')
    return value.charAt(0).toUpperCase() + value.slice(1)
  if (key === 'min' || key === 'max')
    return `₹${Number(value).toLocaleString()}`
  if (key === 'rating') return `${value}+ stars`
  return value
}

export function ActiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const entries = Array.from(searchParams.entries()).filter(
    ([key]) => key !== 'page',
  )

  if (entries.length === 0) return null

  function removeFilter(key: string) {
    const updated = new URLSearchParams(searchParams.toString())
    updated.delete(key)
    updated.delete('page')
    router.push(`/products?${updated.toString()}`)
  }

  function clearAll() {
    router.push('/products')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-1.5 bg-accent-soft text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/10"
        >
          <span>
            {labelMap[key] || key}: {formatValue(key, value)}
          </span>
          <button
            onClick={() => removeFilter(key)}
            className="p-0.5 rounded-full hover:bg-primary/10 transition-colors"
            aria-label={`Remove ${key} filter`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-muted hover:text-primary font-medium px-2 py-1 transition-colors"
      >
        Clear all
      </button>
    </div>
  )
}
