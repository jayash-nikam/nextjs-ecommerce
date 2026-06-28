import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductById, getSimilarProducts } from '@/lib/api/products'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductDetailActions } from '@/components/product/ProductDetailActions'
import { ProductDetailTabs } from '@/components/product/ProductDetailTabs'
import { ProductTrustBar } from '@/components/product/ProductTrustBar'
import { SimilarProducts } from '@/components/product/SimilarProducts'
import { CATEGORY_META } from '@/lib/constants'
import { Star, ChevronRight, Package } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const product = await getProductById(id)
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images[0] ? [{ url: product.images[0], alt: product.title }] : [],
        type: 'website',
      },
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductDetail({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)
  const similar = await getSimilarProducts(product, 4)
  const categoryLabel =
    CATEGORY_META[product.category as keyof typeof CATEGORY_META]?.label ??
    product.category

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
    },
  }

  return (
    <div className="animate-fade-in-up page-pdp pb-4 sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {categoryLabel}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      <div className="pdp-grid">
        <ProductGallery images={product.images} title={product.title} />

        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          <div className="space-y-4">
            <Link
              href={`/products?brand=${encodeURIComponent(product.brand)}`}
              className="inline-flex text-xs uppercase tracking-wider text-primary font-semibold hover:underline"
            >
              {product.brand}
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15]">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                <Star size={16} className="text-warning fill-warning" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-xs text-muted">/ 5</span>
              </div>
              <span
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${
                  product.stock > 10
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : product.stock > 0
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                <Package size={14} />
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </span>
              <span className="text-xs text-muted capitalize px-2 py-1 rounded-lg bg-border-subtle">
                {categoryLabel}
              </span>
            </div>
          </div>

          <ProductDetailActions product={product} />
          <ProductTrustBar />

          <p className="text-muted leading-relaxed text-sm sm:text-base line-clamp-4 lg:line-clamp-none">
            {product.description}
          </p>
        </div>
      </div>

      <ProductDetailTabs product={product} />
      <SimilarProducts products={similar} category={product.category} />
    </div>
  )
}
