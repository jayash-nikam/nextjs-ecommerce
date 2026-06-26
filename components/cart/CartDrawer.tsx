'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import {
  useCartStore,
  getCartTotal,
  getCartCount,
} from '@/store/useCartStore'

export function CartDrawer() {
  const items = useCartStore((state) => state.items)
  const isOpen = useCartStore((state) => state.isOpen)
  const closeCart = useCartStore((state) => state.closeCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const total = getCartTotal(items)
  const count = getCartCount(items)

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
      />

      <aside className="fixed top-0 right-0 h-full w-full max-w-md glass z-[80] flex flex-col shadow-card-hover">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-semibold text-lg">
              Cart {count > 0 && `(${count})`}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-border-subtle transition-colors"
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
              className="btn-primary px-6 py-2.5"
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
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-border-subtle">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
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
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-border-subtle"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-border-subtle"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-muted hover:text-danger transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-5 border-t border-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted">Subtotal</span>
                <span className="text-xl font-bold">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-primary w-full py-3"
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
