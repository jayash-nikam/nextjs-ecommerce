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
    <article className="group flex flex-col h-full card-surface overflow-hidden hover:-translate-y-1">
      <Link
        href={`/products/${product.id}`}
        className="relative h-56 bg-border-subtle overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-warning/90 text-white rounded-lg backdrop-blur-sm">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold bg-danger/90 text-white rounded-lg backdrop-blur-sm">
            Sold Out
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="space-y-2.5">
          <p className="text-xs uppercase tracking-wider text-muted font-medium">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
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

        <div className="space-y-3 pt-5 border-t border-border-subtle mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>

            <div className="flex items-center gap-1 text-sm">
              <Star size={15} className="text-warning fill-warning" />
              <span className="font-semibold">{product.rating}</span>
            </div>
          </div>

          <p
            className={`text-xs font-medium ${
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
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-accent hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
