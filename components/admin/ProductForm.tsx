'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Product } from '@/types/product'
import { adminHeaders, useAdminStore } from '@/store/useAdminStore'
import { FormField, inputClassName } from '@/components/ui/FormField'
import { FormAlert } from '@/components/ui/FormAlert'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { FieldErrors } from '@/lib/validation'
import type { ProductFormData } from '@/lib/validation/product'

interface Props {
  product?: Product | null
  onCancel: () => void
  onSaved: () => void
}

function productToForm(p: Product) {
  return {
    title: p.title,
    brand: p.brand,
    price: String(p.price),
    category: p.category,
    rating: String(p.rating),
    stock: String(p.stock),
    description: p.description,
    tags: p.tags.join(', '),
    specs: Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
    images: p.images.join('\n'),
  }
}

const empty = {
  title: '',
  brand: '',
  price: '',
  category: 'laptop',
  rating: '4.5',
  stock: '10',
  description: '',
  tags: '',
  specs: '',
  images: '',
}

export function ProductForm({ product, onCancel, onSaved }: Props) {
  const token = useAdminStore((s) => s.token)
  const [form, setForm] = useState(product ? productToForm(product) : empty)
  const [errors, setErrors] = useState<FieldErrors<ProductFormData>>({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  function setField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setServerError('')
    setErrors({})

    const url = product
      ? `/api/admin/products/${product.id}`
      : '/api/admin/products'
    const method = product ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: adminHeaders(token),
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      if (data.errors) setErrors(data.errors)
      setServerError(data.error || 'Failed to save')
      setSaving(false)
      return
    }

    onSaved()
    setSaving(false)
  }

  const fields: { key: keyof typeof form; label: string; type?: string; full?: boolean; hint?: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'brand', label: 'Brand' },
    { key: 'price', label: 'Price (₹)', type: 'number' },
    { key: 'stock', label: 'Stock', type: 'number' },
    { key: 'rating', label: 'Rating (0–5)', type: 'number' },
    { key: 'description', label: 'Description', full: true },
    { key: 'tags', label: 'Tags', full: true, hint: 'Comma-separated' },
    { key: 'specs', label: 'Specs', full: true, hint: 'One per line: key: value' },
    { key: 'images', label: 'Image URLs', full: true, hint: 'One URL per line' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-slate-800/80 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <h3 className="font-semibold text-white">
        {product ? 'Edit Product' : 'New Product'}
      </h3>

      {serverError && <FormAlert variant="dark">{serverError}</FormAlert>}

      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type, full, hint }) => (
          <div key={key} className={full ? 'sm:col-span-2' : ''}>
            <FormField
            key={key}
            label={label}
            htmlFor={`pf-${key}`}
            error={errors[key]}
            hint={hint}
            required={key !== 'tags'}
            theme="dark"
          >
            {key === 'description' || key === 'specs' || key === 'images' ? (
              <textarea
                id={`pf-${key}`}
                rows={key === 'description' ? 4 : 3}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                className={`${inputClassName(!!errors[key])} bg-slate-900 border-white/10 text-white resize-y`}
              />
            ) : (
              <input
                id={`pf-${key}`}
                type={type || 'text'}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                className={`${inputClassName(!!errors[key])} bg-slate-900 border-white/10 text-white`}
              />
            )}
          </FormField>
          </div>
        ))}

        <FormField label="Category" htmlFor="pf-category" error={errors.category} required theme="dark">
          <select
            id="pf-category"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className={`${inputClassName(!!errors.category)} bg-slate-900 border-white/10 text-white`}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
