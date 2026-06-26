import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types/product'
import { ArrowRight } from 'lucide-react'

interface Props {
  products: Product[]
  category: string
}

export function SimilarProducts({ products, category }: Props) {
  if (products.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Similar <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted text-sm mt-1">
            More in {category.charAt(0).toUpperCase() + category.slice(1)}
          </p>
        </div>
        <Link
          href={`/products?category=${category}`}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          View all
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
