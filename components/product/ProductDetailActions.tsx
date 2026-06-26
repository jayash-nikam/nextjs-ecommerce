'use client'

import { useState } from 'react'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/useCartStore'
import { showToast } from '@/store/useToastStore'
import {
  ShoppingBag,
  Minus,
  Plus,
} from 'lucide-react'

interface Props {
  product: Product
}

export function ProductDetailActions({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart)
  const [quantity, setQuantity] = useState(1)

  const maxQty = Math.min(product.stock, 10)
  const outOfStock = product.stock === 0

  function handleAddToCart() {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? '',
      },
      quantity,
    )
    showToast(
      quantity > 1
        ? `${quantity}× ${product.title} added to cart`
        : `${product.title} added to cart`,
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-3xl sm:text-4xl font-bold gradient-text">
          ₹{product.price.toLocaleString()}
        </p>
        {product.rating >= 4.5 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Top Rated
          </span>
        )}
      </div>

      {!outOfStock && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted">Quantity</span>
          <div className="flex items-center rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2.5 hover:bg-border-subtle transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              className="p-2.5 hover:bg-border-subtle transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={18} />
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
