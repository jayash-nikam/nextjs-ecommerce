'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Loader2,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react'
import type { SearchSuggestion } from '@/lib/api/products'
import { POPULAR_SEARCHES } from '@/lib/constants'

interface Props {
  className?: string
  expandable?: boolean
  align?: 'left' | 'right'
  onNavigate?: () => void
  variant?: 'light' | 'dark'
}

const RECENT_KEY = 'ai-store-recent-searches'

function loadRecent(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecent(term: string) {
  const recent = loadRecent().filter((r) => r !== term)
  recent.unshift(term)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)))
}

export function SearchBox({
  className = '',
  expandable = false,
  align = 'left',
  onNavigate,
  variant = 'light',
}: Props) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const listboxId = useId()
  const inputId = useId()

  const isExpanded = expandable ? expanded || query.length > 0 : true
  const isDark = variant === 'dark'

  useEffect(() => {
    if (pathname === '/products') {
      setQuery(searchParams.get('q') || '')
    }
  }, [pathname, searchParams])

  useEffect(() => {
    setRecent(loadRecent())
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        if (expandable && !query) setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expandable, query])

  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(term.trim())}`,
      )
      const data: SearchSuggestion[] = await res.json()
      setSuggestions(data)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(value: string) {
    setQuery(value)
    setOpen(true)
    setActiveIndex(-1)
    if (expandable) setExpanded(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300)
  }

  function navigateToSearch(term: string) {
    const trimmed = term.trim()
    if (!trimmed) return

    saveRecent(trimmed)
    setRecent(loadRecent())

    const params = new URLSearchParams(
      pathname === '/products' ? searchParams.toString() : '',
    )
    params.set('q', trimmed)
    params.delete('page')
    router.push(`/products?${params.toString()}`)
    setOpen(false)
    setActiveIndex(-1)
    onNavigate?.()
  }

  function getFlatOptions(): Array<
    | { type: 'term'; value: string }
    | { type: 'product'; value: SearchSuggestion }
  > {
    if (query.trim().length >= 2) {
      return suggestions.map((s) => ({ type: 'product' as const, value: s }))
    }
    return [...recent, ...POPULAR_SEARCHES].map((t) => ({
      type: 'term' as const,
      value: t,
    }))
  }

  function selectOption(index: number) {
    const options = getFlatOptions()
    const option = options[index]
    if (!option) return

    if (option.type === 'product') {
      saveRecent(option.value.title)
      router.push(`/products/${option.value.id}`)
      setOpen(false)
      onNavigate?.()
      return
    }

    navigateToSearch(option.value)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0) {
      selectOption(activeIndex)
      return
    }
    navigateToSearch(query)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const options = getFlatOptions()

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      if (expandable && !query) setExpanded(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectOption(activeIndex)
    }
  }

  function handleExpand() {
    setExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const showPopular = query.trim().length < 2
  const hasSearchQuery = query.trim().length >= 2
  const options = getFlatOptions()
  const dropdownOpen =
    open && isExpanded && (showPopular || hasSearchQuery)

  const dropdownClass = [
    'search-dropdown',
    align === 'right' ? 'search-dropdown--align-right' : '',
    isDark ? 'search-dropdown--dark' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className={`
          relative flex items-center rounded-xl border shadow-sm
          transition-all duration-300 ease-out overflow-hidden
          ${isDark ? 'header-search' : 'border-border bg-card focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30'}
          ${isExpanded ? 'w-full min-w-[18rem] sm:min-w-[20rem]' : 'w-36 sm:w-40 cursor-pointer'}
        `}
        onClick={() => expandable && !isExpanded && handleExpand()}
      >
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <Search
          size={16}
          className={`absolute left-3 pointer-events-none shrink-0 ${isDark ? 'text-white/50' : 'text-muted'}`}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="q"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            setOpen(true)
            if (expandable) setExpanded(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={isExpanded ? 'Search products...' : 'Search...'}
          className={`
            w-full pl-9 pr-8 py-2.5 text-sm bg-transparent outline-none transition-opacity
            ${isDark ? 'text-white placeholder:text-white/45' : 'placeholder:text-muted-foreground'}
            ${isExpanded ? 'opacity-100' : 'opacity-90 truncate'}
          `}
          readOnly={expandable && !isExpanded}
          autoComplete="off"
          role="combobox"
          aria-expanded={dropdownOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
        />
        {loading && isExpanded && (
          <Loader2
            size={14}
            className={`absolute right-3 animate-spin ${isDark ? 'text-white/50' : 'text-muted'}`}
            aria-hidden="true"
          />
        )}
      </form>

      {dropdownOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className={dropdownClass}
        >
          {loading && !showPopular ? (
            <p className="search-dropdown__loading" role="status">
              Searching…
            </p>
          ) : showPopular ? (
            <div className="p-3 space-y-4">
              {recent.length > 0 && (
                <div>
                  <p className="search-dropdown__section-title">
                    <Clock size={12} aria-hidden="true" />
                    Recent
                  </p>
                  <div className="space-y-0.5" role="group" aria-label="Recent searches">
                    {recent.map((term, i) => (
                      <button
                        key={term}
                        id={`${listboxId}-option-${i}`}
                        type="button"
                        role="option"
                        aria-selected={activeIndex === i}
                        onClick={() => navigateToSearch(term)}
                        className={`search-dropdown__option${activeIndex === i ? ' search-dropdown__option--active' : ''}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="search-dropdown__section-title">
                  <TrendingUp size={12} aria-hidden="true" />
                  Popular
                </p>
                <div className="flex flex-wrap gap-1.5 px-1" role="group" aria-label="Popular searches">
                  {POPULAR_SEARCHES.map((term, i) => {
                    const idx = recent.length + i
                    return (
                      <button
                        key={term}
                        id={`${listboxId}-option-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={activeIndex === idx}
                        onClick={() => navigateToSearch(term)}
                        className={`search-dropdown__chip${activeIndex === idx ? ' search-dropdown__chip--active' : ''}`}
                      >
                        {term}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2" role="presentation">
              {suggestions.map((item, i) => (
                <li key={item.id} role="presentation">
                  <Link
                    id={`${listboxId}-option-${i}`}
                    href={`/products/${item.id}`}
                    role="option"
                    aria-selected={activeIndex === i}
                    onClick={() => {
                      saveRecent(item.title)
                      setOpen(false)
                      onNavigate?.()
                    }}
                    className={`search-dropdown__product${activeIndex === i ? ' search-dropdown__product--active' : ''}`}
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-border-subtle">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt=""
                          aria-hidden="true"
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs opacity-70">
                        {item.brand} · {item.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="search-dropdown__footer" role="presentation">
                <button
                  type="button"
                  onClick={() => navigateToSearch(query)}
                  className="search-dropdown__see-all"
                >
                  See all results for &quot;{query}&quot;
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </li>
            </ul>
          ) : (
            <p className="search-dropdown__empty" role="status">
              No products found for &quot;{query}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
