import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  CATEGORY_META,
  type ProductCategory,
} from '@/lib/constants'

const categoryImages: Record<ProductCategory, string> = {
  laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600',
  monitor:
    'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1600',
  audio:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600',
  accessories:
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1600',
  storage:
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1600',
}

const defaultImage =
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1600'

interface Props {
  category?: string
  searchQuery?: string
  total: number
}

export function PLPHero({ category, searchQuery, total }: Props) {
  const cat = category as ProductCategory | undefined
  const meta = cat ? CATEGORY_META[cat] : null
  const image = cat ? categoryImages[cat] : defaultImage

  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : meta
      ? meta.label
      : 'All Products'

  const subtitle = searchQuery
    ? `${total} matching product${total !== 1 ? 's' : ''}`
    : meta
      ? meta.description
      : 'Browse our full catalog of premium tech'

  return (
    <section className="relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] overflow-hidden mb-10">
      <div className="relative min-h-[220px] sm:min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-accent/80 to-indigo-900" />
        <Image
          src={image}
          alt=""
          fill
          className="object-cover opacity-25 mix-blend-overlay"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {meta && !searchQuery && (
                <span className="text-3xl mb-2 block">{meta.icon}</span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {title}
              </h1>
              <p className="text-white/75 mt-2 text-sm sm:text-base">
                {subtitle}
              </p>
            </div>

            {!searchQuery && (
              <Link
                href={cat ? '/products' : '/products?sort=rating_desc'}
                className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-white hover:bg-white/90 transition-all shrink-0"
              >
                {cat ? 'View all products' : 'Top rated'}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
