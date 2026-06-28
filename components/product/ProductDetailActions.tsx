'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/useCartStore'
import { showToast } from '@/store/useToastStore'
import { ShoppingBag, Minus, Plus } from 'lucide-react'

interface Props {
  product: Product
}

const MOBILE_MQ = '(max-width: 1023px)'

export function ProductDetailActions({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart)
  const [quantity, setQuantity] = useState(1)
  const [showSticky, setShowSticky] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const maxQty = Math.min(product.stock, 10)
  const outOfStock = product.stock === 0

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia(MOBILE_MQ)
    setIsMobile(mq.matches)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !isMobile || outOfStock) {
      setShowSticky(false)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setShowSticky(!entry.isIntersecting)
      },
      {
        threshold: 0,
        // Trigger once the CTA has scrolled above the viewport (below header).
        rootMargin: '-64px 0px 0px 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, outOfStock])

  useEffect(() => {
    document.body.classList.toggle(
      'has-mobile-purchase-bar',
      mounted && isMobile && showSticky && !outOfStock,
    )
    return () => document.body.classList.remove('has-mobile-purchase-bar')
  }, [mounted, isMobile, showSticky, outOfStock])

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

  const stickyBar =
    mounted && isMobile && showSticky && !outOfStock ? (
      <div className="mobile-purchase-bar" role="region" aria-label="Quick purchase">
        <div className="min-w-0 flex-1">
          <p className="mobile-purchase-bar__price">
            ₹{(product.price * quantity).toLocaleString()}
          </p>
          <p className="mobile-purchase-bar__meta line-clamp-1">
            {quantity > 1 ? `${quantity} × ` : ''}
            {product.title}
          </p>
        </div>
        <button type="button" onClick={handleAddToCart} className="mobile-purchase-bar__btn">
          <ShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    ) : null

  return (
    <>
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
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-border-subtle transition-colors touch-target"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="p-3 hover:bg-border-subtle transition-colors touch-target"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed min-h-[3rem]"
        >
          <ShoppingBag size={18} />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Sentinel: sticky bar shows when this scrolls out of view */}
        <div ref={sentinelRef} className="h-px w-full lg:hidden" aria-hidden="true" />
      </div>

      {stickyBar && createPortal(stickyBar, document.body)}
    </>
  )
}
