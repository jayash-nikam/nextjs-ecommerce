import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/lib/api/products'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4)

  if (products.length === 0) return null

  return (
    <section className="py-14 sm:py-20 border-t border-border">
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Featured <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted mt-2">Top-rated picks this season</p>
        </div>
        <Link
          href="/products?sort=rating_desc"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          See all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
