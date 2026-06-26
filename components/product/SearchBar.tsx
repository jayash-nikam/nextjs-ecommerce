'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { FilterMeta } from '@/lib/filters'

export { PRODUCT_CATEGORIES, PRICE_MIN, PRICE_MAX } from '@/lib/constants'

const sortOptions = [
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Rating: High → Low', value: 'rating_desc' },
]

const ratingOptions = [
  { label: '4.5 & above', value: '4.5' },
  { label: '4.0 & above', value: '4.0' },
]

function clampPrice(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function FiltersSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentBrand = searchParams.get('brand') || ''
  const currentSort = searchParams.get('sort') || ''
  const currentRating = searchParams.get('rating') || ''
  const currentSearch = searchParams.get('q') || ''

  const [meta, setMeta] = useState<FilterMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [localSearch, setLocalSearch] = useState(currentSearch)

  const skipPricePush = useRef(true)
  const priceDebounce = useRef<ReturnType<typeof setTimeout>>(null)

  const hasFilters =
    currentSearch ||
    searchParams.get('category') ||
    searchParams.get('brand') ||
    searchParams.get('sort') ||
    searchParams.get('min') ||
    searchParams.get('max') ||
    searchParams.get('rating')

  const catalogMin = meta?.catalogPriceRange.min ?? 0
  const catalogMax = meta?.catalogPriceRange.max ?? 0
  const rangeSpan = Math.max(catalogMax - catalogMin, 1)
  const minGap = Math.min(1000, Math.floor(rangeSpan / 4) || 1)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/filters?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((data: FilterMeta) => {
        setMeta(data)

        const bounds = data.catalogPriceRange
        if (bounds.max <= bounds.min) return

        const span = Math.max(bounds.max - bounds.min, 1)
        const gap = Math.min(1000, Math.floor(span / 4) || 1)

        const urlMin = searchParams.get('min')
        const urlMax = searchParams.get('max')

        skipPricePush.current = true

        const nextMin = urlMin !== null
          ? clampPrice(Number(urlMin), bounds.min, bounds.max)
          : bounds.min
        const nextMax = urlMax !== null
          ? clampPrice(Number(urlMax), bounds.min, bounds.max)
          : bounds.max

        setMinPrice(Math.min(nextMin, nextMax - gap))
        setMaxPrice(Math.max(nextMax, nextMin + gap))
      })
      .catch(() => setMeta(null))
      .finally(() => setLoading(false))
  }, [searchParams])

  useEffect(() => {
    setLocalSearch(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    if (!meta || catalogMax <= catalogMin) return

    if (skipPricePush.current) {
      skipPricePush.current = false
      return
    }

    if (priceDebounce.current) clearTimeout(priceDebounce.current)

    priceDebounce.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const currentMin = searchParams.get('min')
      const currentMax = searchParams.get('max')

      const newMin = minPrice > catalogMin ? String(minPrice) : null
      const newMax = maxPrice < catalogMax ? String(maxPrice) : null

      if (currentMin === newMin && currentMax === newMax) return

      if (newMin) params.set('min', newMin)
      else params.delete('min')
      if (newMax) params.set('max', newMax)
      else params.delete('max')

      params.delete('page')
      router.push(`/products?${params.toString()}`)
    }, 500)

    return () => {
      if (priceDebounce.current) clearTimeout(priceDebounce.current)
    }
  }, [minPrice, maxPrice, meta, catalogMin, catalogMax, router, searchParams])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = localSearch.trim()
      const current = searchParams.get('q') || ''
      if (trimmed === current) return

      const params = new URLSearchParams(searchParams.toString())
      if (trimmed) params.set('q', trimmed)
      else params.delete('q')
      params.delete('page')
      router.push(`/products?${params.toString()}`)
    }, 400)

    return () => clearTimeout(timeout)
  }, [localSearch, router, searchParams])

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'sort') {
      params.delete('min')
      params.delete('max')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  function clearAll() {
    router.push('/products')
  }

  function clearPriceFilter() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('min')
    params.delete('max')
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  function handleMinChange(value: number) {
    setMinPrice(Math.min(value, maxPrice - minGap))
  }

  function handleMaxChange(value: number) {
    setMaxPrice(Math.max(value, minPrice + minGap))
  }

  if (loading && !meta) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-sm">
      <div className="hidden lg:flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          {meta && (
            <p className="text-xs text-muted mt-0.5">
              {meta.totalProducts} products
            </p>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2" role="search">
        <label htmlFor="filter-search" className="text-xs font-semibold uppercase tracking-wider text-muted">
          Search
        </label>
        <input
          id="filter-search"
          type="search"
          name="q"
          placeholder="Search by name, brand..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="form-input"
          autoComplete="off"
        />
      </div>

      <div className="border-t border-border" />

      {meta && meta.categories.length > 0 && (
        <>
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Category
            </h3>
            <div className="space-y-1">
              {meta.categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    updateParam(
                      'category',
                      currentCategory === cat.value ? '' : cat.value,
                    )
                  }
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm
                    transition-all duration-200
                    ${
                      currentCategory === cat.value
                        ? 'bg-accent-soft text-primary font-semibold shadow-sm'
                        : 'text-muted hover:bg-border-subtle hover:text-foreground'
                    }
                  `}
                >
                  <span>{cat.label}</span>
                  <span className="text-xs opacity-70">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border" />
        </>
      )}

      {meta && meta.brands.length > 0 && (
        <>
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Brand
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {meta.brands.slice(0, 15).map((brand) => (
                <button
                  key={brand.value}
                  onClick={() =>
                    updateParam(
                      'brand',
                      currentBrand === brand.value ? '' : brand.value,
                    )
                  }
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm
                    transition-all duration-200
                    ${
                      currentBrand === brand.value
                        ? 'bg-accent-soft text-primary font-semibold shadow-sm'
                        : 'text-muted hover:bg-border-subtle hover:text-foreground'
                    }
                  `}
                >
                  <span className="truncate">{brand.label}</span>
                  <span className="text-xs opacity-70 shrink-0 ml-2">
                    {brand.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border" />
        </>
      )}

      {meta && catalogMax > catalogMin && (
        <>
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Price Range
            </h3>
            <div className="flex justify-between font-semibold text-foreground">
              <span>₹{minPrice.toLocaleString()}</span>
              <span>₹{maxPrice.toLocaleString()}</span>
            </div>
            <div className="relative h-6">
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-border rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"
                style={{
                  left: `${((minPrice - catalogMin) / rangeSpan) * 100}%`,
                  right: `${100 - ((maxPrice - catalogMin) / rangeSpan) * 100}%`,
                }}
              />
              <input
                type="range"
                min={catalogMin}
                max={catalogMax}
                step={500}
                value={minPrice}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min={catalogMin}
                max={catalogMax}
                step={500}
                value={maxPrice}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
            {(searchParams.get('min') || searchParams.get('max')) && (
              <button
                type="button"
                onClick={clearPriceFilter}
                className="text-xs text-primary hover:underline"
              >
                Reset price filter
              </button>
            )}
          </div>
          <div className="border-t border-border" />
        </>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Rating
        </h3>
        <div className="space-y-1">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateParam(
                  'rating',
                  currentRating === option.value ? '' : option.value,
                )
              }
              className={`
                w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                ${
                  currentRating === option.value
                    ? 'bg-accent-soft text-primary font-semibold shadow-sm'
                    : 'text-muted hover:bg-border-subtle hover:text-foreground'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Sort By
        </h3>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                updateParam(
                  'sort',
                  currentSort === option.value ? '' : option.value,
                )
              }
              className={`
                w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                ${
                  currentSort === option.value
                    ? 'bg-accent-soft text-primary font-semibold shadow-sm'
                    : 'text-muted hover:bg-border-subtle hover:text-foreground'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
