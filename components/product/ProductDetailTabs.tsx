'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types/product'
import { CATEGORY_META } from '@/lib/constants'
import { Check, FileText, List, Sparkles } from 'lucide-react'

interface Props {
  product: Product
}

const tabs = [
  { id: 'description', label: 'Description', icon: FileText },
  { id: 'specs', label: 'Specifications', icon: List },
  { id: 'highlights', label: 'Highlights', icon: Sparkles },
] as const

type TabId = (typeof tabs)[number]['id']

export function ProductDetailTabs({ product }: Props) {
  const [active, setActive] = useState<TabId>('description')
  const specs = Object.entries(product.specs || {})
  const categoryLabel =
    CATEGORY_META[product.category as keyof typeof CATEGORY_META]?.label ??
    product.category

  const highlights = [
    `Premium ${product.brand} quality`,
    `${product.rating}★ customer rating`,
    product.stock > 10 ? 'In stock — ships fast' : product.stock > 0 ? 'Limited stock available' : 'Currently unavailable',
    `Category: ${categoryLabel}`,
    ...product.tags.slice(0, 3).map((t) => `Tagged: ${t}`),
  ]

  return (
    <section className="mt-14">
      <div className="flex flex-wrap gap-2 border-b border-border mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              active === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {active === 'description' && (
        <div className="card-surface p-6 sm:p-8 space-y-4">
          <p className="text-muted leading-relaxed text-base">{product.description}</p>
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/products?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-accent-soft text-primary px-3 py-1 rounded-full font-medium hover:bg-primary/10 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {active === 'specs' && (
        <div className="card-surface overflow-hidden">
          {specs.length > 0 ? (
            <dl className="divide-y divide-border">
              {specs.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center px-6 py-4 hover:bg-border-subtle/50 transition-colors gap-4"
                >
                  <dt className="text-sm text-muted capitalize shrink-0">
                    {key.replace(/_/g, ' ')}
                  </dt>
                  <dd className="text-sm font-semibold text-right flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-500 shrink-0" />
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted text-sm p-6">No specifications listed.</p>
          )}
        </div>
      )}

      {active === 'highlights' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 card-surface p-4"
            >
              <span className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                <Check size={16} className="text-primary" />
              </span>
              <p className="text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
