'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ExternalLink,
  Loader2,
  Minus,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Product } from '@/types/product'
import { adminHeaders, useAdminStore } from '@/store/useAdminStore'
import { showToast } from '@/store/useToastStore'
import { ProductForm } from '@/components/admin/ProductForm'
import { CATEGORY_META, PRODUCT_CATEGORIES } from '@/lib/constants'
import { AdminSearchInput, AdminSelect } from '@/components/admin/admin-ui'

type SortKey = 'title' | 'price' | 'stock' | 'rating'
type StockFilter = 'all' | 'low' | 'out' | 'healthy'

export function ProductsManager() {
  const token = useAdminStore((s) => s.token)
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(
    searchParams.get('category') || 'all',
  )
  const [stockFilter, setStockFilter] = useState<StockFilter>(
    (searchParams.get('stock') as StockFilter) || 'all',
  )
  const [sort, setSort] = useState<SortKey>('title')
  const [stockUpdating, setStockUpdating] = useState<number | null>(null)

  function load() {
    return fetch('/api/admin/products', { headers: adminHeaders(token) })
      .then((res) => res.json())
      .then(setProducts)
  }

  useEffect(() => {
    load()
      .catch(() => showToast('Failed to load products'))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    const cat = searchParams.get('category')
    const stock = searchParams.get('stock') as StockFilter | null
    if (cat) setCategory(cat)
    if (stock) setStockFilter(stock)
  }, [searchParams])

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
    if (res.ok) {
      showToast('Product deleted')
      await load()
    } else {
      showToast('Failed to delete product')
    }
  }

  async function adjustStock(product: Product, delta: number) {
    const next = Math.max(0, product.stock + delta)
    if (next === product.stock) return

    setStockUpdating(product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: adminHeaders(token),
        body: JSON.stringify({ stock: next }),
      })
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, stock: next } : p)),
        )
        showToast(`Stock updated to ${next}`)
      } else {
        showToast('Failed to update stock')
      }
    } finally {
      setStockUpdating(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (stockFilter === 'low' && !(p.stock > 0 && p.stock <= 10)) return false
      if (stockFilter === 'out' && p.stock !== 0) return false
      if (stockFilter === 'healthy' && p.stock <= 10) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price':
          return a.price - b.price
        case 'stock':
          return a.stock - b.stock
        case 'rating':
          return b.rating - a.rating
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return list
  }, [products, search, category, stockFilter, sort])

  const stats = useMemo(
    () => ({
      low: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      out: products.filter((p) => p.stock === 0).length,
    }),
    [products],
  )

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} of {products.length} · {stats.low} low stock ·{' '}
            {stats.out} out of stock
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true)
            setEditing(null)
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 flex-wrap">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search products…"
        />
        <AdminSelect
          value={category}
          onChange={setCategory}
          options={[
            { value: 'all', label: 'All categories' },
            ...PRODUCT_CATEGORIES.map((c) => ({
              value: c,
              label: CATEGORY_META[c].label,
            })),
          ]}
        />
        <AdminSelect
          value={stockFilter}
          onChange={(v) => setStockFilter(v as StockFilter)}
          options={[
            { value: 'all', label: 'All stock levels' },
            { value: 'low', label: 'Low stock (≤10)' },
            { value: 'out', label: 'Out of stock' },
            { value: 'healthy', label: 'Well stocked' },
          ]}
        />
        <AdminSelect
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={[
            { value: 'title', label: 'Sort: Name' },
            { value: 'price', label: 'Sort: Price' },
            { value: 'stock', label: 'Sort: Stock' },
            { value: 'rating', label: 'Sort: Rating' },
          ]}
        />
      </div>

      {(creating || editing) && (
        <ProductForm
          product={editing}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSaved={async () => {
            setCreating(false)
            setEditing(null)
            await load()
            showToast(editing ? 'Product updated' : 'Product created')
          }}
        />
      )}

      <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden responsive-scroll">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Rating</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                        <Image
                          src={p.images[0] ?? '/placeholder.png'}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[180px] lg:max-w-[240px]">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 capitalize">
                    {CATEGORY_META[p.category as keyof typeof CATEGORY_META]
                      ?.label ?? p.category}
                  </td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    ₹{p.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={stockUpdating === p.id || p.stock === 0}
                        onClick={() => adjustStock(p, -1)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30"
                        aria-label="Decrease stock"
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className={`min-w-[2rem] text-center font-semibold ${
                          p.stock === 0
                            ? 'text-red-400'
                            : p.stock <= 10
                              ? 'text-amber-400'
                              : 'text-slate-300'
                        }`}
                      >
                        {p.stock}
                      </span>
                      <button
                        type="button"
                        disabled={stockUpdating === p.id}
                        onClick={() => adjustStock(p, 1)}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30"
                        aria-label="Increase stock"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 hidden md:table-cell">
                    {p.rating}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/products/${p.id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                        title="View on store"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          setEditing(p)
                          setCreating(false)
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                        aria-label="Edit product"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                        aria-label="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No products found</p>
        )}
      </div>
    </div>
  )
}
