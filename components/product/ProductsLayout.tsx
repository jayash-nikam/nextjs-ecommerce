'use client'

import { Suspense, useState } from 'react'
import { FiltersSidebar } from '@/components/product/SearchBar'
import { SlidersHorizontal, X } from 'lucide-react'

export function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setOpen(true)}
          className="btn-secondary w-full sm:w-auto"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        <aside
          className={`
            filters-panel fixed lg:static top-0 left-0 h-full w-80 max-w-[90vw] z-50
            transform transition-transform duration-300 ease-out
            ${open ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:w-72
            lg:sticky lg:top-24 lg:self-start
          `}
        >
          <div className="card-surface p-5 h-full lg:max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="flex justify-between items-center lg:hidden mb-5 pb-4 border-b border-border">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-border-subtle transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
              <FiltersSidebar />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
