'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types/product'
import { PAGE_SIZE } from '@/lib/api/products'

interface Props {
  initialProducts: Product[]
  total: number
}

export function LazyProductGrid({ initialProducts, total }: Props) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length < total)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filterKey = searchParams.toString()

  useEffect(() => {
    setProducts(initialProducts)
    setPage(1)
    setHasMore(initialProducts.length < total)
  }, [filterKey, initialProducts, total])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    const nextPage = page + 1

    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(nextPage))
      params.set('limit', String(PAGE_SIZE))

      const res = await fetch(`/api/products?${params.toString()}`)
      const data: { products: Product[]; total: number } = await res.json()

      setProducts((prev) => {
        const merged = [...prev, ...data.products]
        setHasMore(merged.length < data.total)
        return merged
      })
      setPage(nextPage)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, searchParams])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" aria-hidden />

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={28} className="text-primary animate-spin" />
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-sm text-muted py-8">
          Showing all {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
