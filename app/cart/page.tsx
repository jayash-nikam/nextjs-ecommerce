'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore, getCartTotal, getCartCount } from '@/store/useCartStore'
import { useAuthStore, authHeaders } from '@/store/useAuthStore'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const [mounted, setMounted] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutMsg, setCheckoutMsg] = useState('')

  useEffect(() => setMounted(true), [])

  const total = getCartTotal(items)
  const count = getCartCount(items)

  async function handleCheckout() {
    if (!token || !user) {
      window.location.href = '/account/login'
      return
    }

    setCheckingOut(true)
    setCheckoutMsg('')

    try {
      const addrRes = await fetch('/api/addresses', {
        headers: authHeaders(token),
      })
      const addresses = await addrRes.json()
      const defaultAddr =
        addresses.find((a: { isDefault: boolean }) => a.isDefault) ||
        addresses[0]

      if (!defaultAddr) {
        setCheckoutMsg('Please add a delivery address first.')
        setCheckingOut(false)
        return
      }

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          total,
          shippingAddress: {
            name: defaultAddr.name,
            line1: defaultAddr.line1,
            line2: defaultAddr.line2,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            phone: defaultAddr.phone,
          },
        }),
      })

      if (!orderRes.ok) throw new Error('Order failed')

      clearCart()
      window.location.href = '/account/orders'
    } catch {
      setCheckoutMsg('Checkout failed. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  if (!mounted) {
    return (
      <div className="animate-fade-in-up page-wide">
        <div className="skeleton h-10 w-48 mb-8 rounded-lg" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up page-wide">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Shopping <span className="gradient-text">Cart</span>
        </h1>
        <p className="text-muted mt-2">
          {count} item{count !== 1 ? 's' : ''} in your cart
        </p>
      </header>

      {items.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag size={48} className="text-muted mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted mb-6">Add some products to get started.</p>
          <Link href="/products" className="btn-primary px-8 py-3">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="card-surface cart-item p-4"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-border-subtle">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.id}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-lg font-bold mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center rounded-lg border border-border overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-border-subtle"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-border-subtle"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-muted hover:text-danger flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-bold cart-item__total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="card-surface p-6 h-fit space-y-4 lg:sticky lg:top-24">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="flex justify-between text-muted">
              <span>Subtotal ({count} items)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted text-sm">
              <span>Shipping</span>
              <span>{total >= 50000 ? 'Free' : 'Calculated at checkout'}</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="gradient-text">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary w-full py-3.5 disabled:opacity-60"
            >
              {checkingOut ? 'Placing order...' : 'Proceed to Checkout'}
            </button>
            {checkoutMsg && (
              <p className="text-sm text-red-600 text-center">{checkoutMsg}</p>
            )}
            {!user && mounted && (
              <p className="text-xs text-muted text-center">
                <Link href="/account/login" className="text-primary hover:underline">
                  Sign in
                </Link>{' '}
                to checkout
              </p>
            )}
            <button
              onClick={clearCart}
              className="btn-secondary w-full py-2.5 text-sm"
            >
              Clear Cart
            </button>
            <Link
              href="/products"
              className="block text-center text-sm text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
