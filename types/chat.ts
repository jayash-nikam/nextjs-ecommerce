export type ChatRole = 'user' | 'assistant'

export interface ChatProduct {
  id: number
  title: string
  brand: string
  category: string
  price: number
  rating: number
  stock: number
  image: string
}

export type ChatSort = 'relevance' | 'price_asc' | 'price_desc'

/**
 * Lightweight conversation memory carried between turns so the assistant can
 * resolve follow-ups like "show cheaper", "what about Dell?", or "more".
 */
export interface ChatContext {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  sort?: ChatSort
  /** IDs already shown, so "show more" can page through fresh results. */
  shownIds?: number[]
}

/** Shape returned by the /api/chat endpoint */
export interface ChatReply {
  text: string
  products?: ChatProduct[]
  suggestions?: string[]
  /** When set, the UI can offer a "see all results" link to /products?q=... */
  query?: string
  /** Updated conversation memory for the next turn. */
  context?: ChatContext
}

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  products?: ChatProduct[]
  suggestions?: string[]
  query?: string
  createdAt: number
}
