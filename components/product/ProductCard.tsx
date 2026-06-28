'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/useCartStore'
import { showToast } from '@/store/useToastStore'
import { Star, ShoppingBag } from 'lucide-react'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart)
  const imageSrc = product.images[0] ?? '/placeholder.png'

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? '',
      },
      1,
    )
    showToast(`${product.title} added to cart`)
  }

  return (
    <article className="group flex flex-col h-full card-surface overflow-hidden hover:-translate-y-1 product-card--mobile">
      <Link
        href={`/products/${product.id}`}
        className="relative product-card__image h-44 sm:h-56 bg-border-subtle overflow-hidden block"
      >
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[0.6875rem] font-semibold bg-warning/90 text-white rounded-lg backdrop-blur-sm">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[0.6875rem] font-semibold bg-danger/90 text-white rounded-lg backdrop-blur-sm">
            Sold Out
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 product-card__body p-4 sm:p-5">
        <div className="space-y-1.5 sm:space-y-2.5">
          <p className="text-[0.6875rem] sm:text-xs uppercase tracking-wider text-muted font-medium">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="product-card__desc text-sm text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="product-card__tags flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-accent-soft text-primary px-2.5 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="product-card__footer space-y-2.5 sm:space-y-3 pt-3 sm:pt-5 border-t border-border-subtle mt-3 sm:mt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>

            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star size={14} className="text-warning fill-warning sm:w-[15px] sm:h-[15px]" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          </div>

          <p
            className={`product-card__stock text-xs font-medium ${
              product.stock > 10
                ? 'text-emerald-600'
                : product.stock > 0
                  ? 'text-warning'
                  : 'text-danger'
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="product-card__btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-accent hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
