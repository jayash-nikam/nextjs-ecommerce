'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/products?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <nav className="flex justify-center items-center gap-2 pt-10" aria-label="Pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl border border-border bg-card hover:bg-border-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1

        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`
              min-w-[40px] h-10 px-3 rounded-xl text-sm font-medium transition-all
              ${
                page === currentPage
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                  : 'bg-card border border-border hover:bg-border-subtle hover:border-primary/20'
              }
            `}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl border border-border bg-card hover:bg-border-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
