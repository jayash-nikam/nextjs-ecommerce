'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import {
  useCartStore,
  getCartTotal,
  getCartCount,
} from '@/store/useCartStore'
import { useBodyScrollLock } from '@/lib/hooks/useBodyScrollLock'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'

export function CartDrawer() {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const total = getCartTotal(items)
  const count = getCartCount(items)

  useBodyScrollLock(isOpen)
  useEscapeKey(isOpen, closeCart)

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal
        aria-label="Shopping cart"
        className="fixed top-0 right-0 h-full w-full max-w-md glass z-[80] flex flex-col shadow-card-hover max-sm:mobile-sheet max-sm:mobile-sheet--right"
      >
        <div className="mobile-sheet__handle sm:hidden" aria-hidden="true" />

        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-semibold text-lg">
              Cart {count > 0 && `(${count})`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2.5 rounded-lg hover:bg-border-subtle transition-colors touch-target"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} className="text-muted mb-4" />
            <p className="font-medium mb-1">Your cart is empty</p>
            <p className="text-sm text-muted mb-6">
              Add products to get started
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="btn-primary px-6 py-3 min-h-[2.75rem]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="relative w-[4.5rem] h-[4.5rem] rounded-lg overflow-hidden shrink-0 bg-border-subtle">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.id}`}
                      onClick={closeCart}
                      className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-semibold mt-1">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-border overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2.5 hover:bg-border-subtle touch-target"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2.5 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2.5 hover:bg-border-subtle touch-target"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 text-muted hover:text-danger transition-colors touch-target"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="shrink-0 p-4 sm:p-5 border-t border-border space-y-4 bg-card/80 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted">Subtotal</span>
                <span className="text-xl font-bold">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-primary w-full py-3.5 min-h-[3rem]"
              >
                View Cart & Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
