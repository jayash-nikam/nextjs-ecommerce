'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useSearchParams } from 'next/navigation'
import { FiltersSidebar } from '@/components/product/SearchBar'
import { useDrawerScrollLock } from '@/lib/hooks/useDrawerScrollLock'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'
import { SlidersHorizontal, X } from 'lucide-react'

function DesktopFilters() {
  return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
      <div className="card-surface p-5 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl">
        <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
          <FiltersSidebar />
        </Suspense>
      </div>
    </aside>
  )
}

function MobileFiltersDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useDrawerScrollLock(open, scrollRef)
  useEscapeKey(open, onClose)

  if (!open) return null

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal
        aria-label="Product filters"
        className="filters-panel filters-panel--drawer fixed top-0 left-0 z-[70] lg:hidden flex flex-col"
      >
        <div className="filters-panel__header shrink-0">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-lg hover:bg-border-subtle transition-colors touch-target"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="filters-panel__scroll">
          <Suspense fallback={<div className="skeleton h-64 rounded-xl" />}>
            <FiltersSidebar />
          </Suspense>
        </div>

        <div className="filters-panel__footer shrink-0">
          <button type="button" onClick={onClose} className="btn-primary w-full min-h-[2.75rem]">
            View Results
          </button>
        </div>
      </aside>
    </>,
    document.body,
  )
}

export function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchKey = searchParams.toString()
  const prevSearchKey = useRef(searchKey)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (searchKey === prevSearchKey.current) return
    prevSearchKey.current = searchKey
    close()
  }, [searchKey, close])

  useEffect(() => {
    prevSearchKey.current = searchKey
    close()
  }, [pathname, close])

  return (
    <div className="relative">
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-secondary w-full min-h-[2.75rem]"
          aria-expanded={open}
        >
          <SlidersHorizontal size={18} />
          Filters & Sort
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <DesktopFilters />

        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {mounted && (
        <MobileFiltersDrawer open={open} onClose={close} />
      )}
    </div>
  )
}
