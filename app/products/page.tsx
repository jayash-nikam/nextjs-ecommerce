import { Suspense } from 'react'
import { getProducts } from '@/lib/api/products'
import type { Metadata } from 'next'
import { ActiveFilters } from '@/components/product/ActiveFilters'
import { ProductsLayout } from '@/components/product/ProductsLayout'
import { LazyProductGrid } from '@/components/product/LazyProductGrid'
import { PLPHero } from '@/components/product/PLPHero'
import { PackageOpen } from 'lucide-react'
import { BRAND_TAGLINE } from '@/lib/brand'

interface Props {
  searchParams: Promise<{
    search?: string
    category?: string
    brand?: string
    min?: string
    max?: string
    page?: string
    sort?: string
    q?: string
    rating?: string
  }>
}

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: BRAND_TAGLINE,
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const filters = {
    category: params.category,
    brand: params.brand,
    min: params.min,
    max: params.max,
    sort: params.sort,
    rating: params.rating,
    search: params.q || params.search,
    page: '1',
  }
  const { products, total } = await getProducts(filters)

  const searchQuery = params.q || params.search
  const filterKey = JSON.stringify({ ...params, page: undefined })

  return (
    <div className="animate-fade-in-up page-full-bleed">
      <PLPHero
        category={params.category}
        searchQuery={searchQuery}
        total={total}
      />

      <div className="page-inset">
        <Suspense fallback={null}>
          <ActiveFilters />
        </Suspense>

        <ProductsLayout>
          {products.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center text-primary mb-5">
                <PackageOpen size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted max-w-md">
                Try adjusting your filters or search terms to find what
                you&apos;re looking for.
              </p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {products.map((p) => (
                    <div key={p.id} className="skeleton h-80 rounded-2xl" />
                  ))}
                </div>
              }
            >
              <LazyProductGrid
                key={filterKey}
                initialProducts={products}
                total={total}
              />
            </Suspense>
          )}
        </ProductsLayout>
      </div>
    </div>
  )
}
