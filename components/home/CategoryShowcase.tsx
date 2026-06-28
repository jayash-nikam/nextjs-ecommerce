import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PRODUCT_CATEGORIES, CATEGORY_META, type ProductCategory } from '@/lib/constants'

const categoryImages: Record<ProductCategory, string> = {
  laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800',
  monitor:
    'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800',
  audio:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
  accessories:
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800',
  storage:
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800',
}

export function CategoryShowcase() {
  return (
    <section className="py-14 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted mt-2">
            Browse our curated collections
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {PRODUCT_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          return (
            <Link
              key={cat}
              href={`/products?category=${cat}`}
              className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden card-surface hover:-translate-y-1 transition-all duration-300"
            >
              <Image
                src={categoryImages[cat]}
                alt={meta.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <span className="text-2xl mb-2 block">{meta.icon}</span>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {meta.label}
                </h3>
                <p className="text-xs text-white/70 mt-0.5 hidden sm:block">
                  {meta.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
