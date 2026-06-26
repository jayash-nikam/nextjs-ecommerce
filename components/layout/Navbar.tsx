'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  User,
  Tag,
  LayoutDashboard,
  Package,
  MapPin,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react'
import { useCartStore, getCartCount } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { SearchBox } from '@/components/layout/SearchBox'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { CartDrawer } from '@/components/cart/CartDrawer'
import {
  PRODUCT_CATEGORIES,
  CATEGORY_META,
} from '@/lib/constants'

const navLinks = [
  { name: 'Products', href: '/products' },
  { name: 'Deals', href: '/products?sort=price_asc' },
]

export function Navbar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const openCart = useCartStore((state) => state.openCart)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const totalCount = mounted ? getCartCount(items) : 0

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    if (accountOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [accountOpen])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    const base = href.split('?')[0] ?? href
    return pathname.startsWith(base)
  }

  function handleLogout() {
    logout()
    setAccountOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

  const accountMenuItems = user
    ? [
        { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
        { name: 'Orders', href: '/account/orders', icon: Package },
        { name: 'Addresses', href: '/account/addresses', icon: MapPin },
      ]
    : [
        { name: 'Sign In', href: '/account/login', icon: LogIn },
        { name: 'Create Account', href: '/account/register', icon: UserPlus },
      ]

  return (
    <>
      <header className="sticky top-0 z-50 site-header border-b">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive(link.href)
                      ? 'header-link-active'
                      : 'header-link'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className={`
                  flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                  ${shopOpen ? 'header-link-active' : 'header-link'}
                `}
              >
                Shop
                <ChevronDown
                  size={14}
                  className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-0 pt-2 w-[560px] z-50">
                  <div className="header-dropdown rounded-2xl p-5">
                    <div className="grid grid-cols-2 gap-1 mb-4">
                      {PRODUCT_CATEGORIES.map((cat) => {
                        const meta = CATEGORY_META[cat]
                        return (
                          <Link
                            key={cat}
                            href={`/products?category=${cat}`}
                            className="header-mega-item flex items-start gap-3 p-3 rounded-xl group"
                          >
                            <span className="text-xl shrink-0">{meta.icon}</span>
                            <div className="min-w-0">
                              <p className="header-mega-item-title font-semibold text-sm">
                                {meta.label}
                              </p>
                              <p className="header-mega-desc text-xs mt-0.5 line-clamp-1">
                                {meta.description}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 pt-3 border-t header-dropdown-divider">
                      <Link
                        href="/products"
                        className="header-dropdown-btn-primary flex-1 text-center py-2.5 rounded-lg text-sm font-medium"
                      >
                        All Products
                      </Link>
                      <Link
                        href="/products?sort=rating_desc"
                        className="header-dropdown-btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        <Tag size={14} />
                        Top Rated
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <SearchBox
              expandable
              align="right"
              variant="dark"
              onNavigate={() => setMobileOpen(false)}
              className="hidden sm:block"
            />

            <div ref={accountRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className={`
                  flex items-center gap-1 p-2.5 rounded-xl transition-colors
                  ${
                    accountOpen
                      ? 'header-link-active'
                      : 'header-link'
                  }
                `}
                aria-label="Account menu"
                aria-expanded={accountOpen}
              >
                <User size={22} className="header-icon" />
                <ChevronDown
                  size={14}
                  className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {accountOpen && (
                <div className="absolute top-full right-0 pt-2 w-52 z-50">
                  <div className="header-dropdown rounded-xl py-1.5">
                    {user && (
                      <p className="header-menu-user px-4 py-2 text-xs border-b truncate">
                        {user.name || user.email}
                      </p>
                    )}
                    {accountMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setAccountOpen(false)}
                        className="header-menu-link flex items-center gap-2.5 px-4 py-2.5 text-sm"
                      >
                        <item.icon size={16} />
                        {item.name}
                      </Link>
                    ))}
                    {user && (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="header-menu-danger w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl header-link transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={22} className="header-icon" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold rounded-full">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden p-2.5 rounded-xl header-link transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} className="header-icon" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[90vw] site-header z-50 lg:hidden
          transition-transform duration-300 ease-out overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <span className="font-semibold text-white">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg header-link"
            aria-label="Close menu"
          >
            <X size={20} className="header-icon" />
          </button>
        </div>

        <div className="p-4 sm:hidden">
          <SearchBox expandable align="right" variant="dark" onNavigate={() => setMobileOpen(false)} />
        </div>

        <nav className="px-3 space-y-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`
                block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${
                  isActive(link.href)
                    ? 'header-link-active'
                    : 'header-link'
                }
              `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="px-3 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider header-muted px-4 mb-2">
            Account
          </p>
          <div className="space-y-1">
            {accountMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm header-link"
              >
                <item.icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-3 pt-4 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider header-muted px-4 mb-2">
            Categories
          </p>
          <div className="space-y-1">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm header-link"
              >
                <span>{CATEGORY_META[cat].icon}</span>
                <span className="font-medium">{CATEGORY_META[cat].label}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <CartDrawer />
    </>
  )
}
