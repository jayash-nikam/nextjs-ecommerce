import { Product } from '@/types/product'
import { ChatContext, ChatProduct, ChatReply, ChatSort } from '@/types/chat'
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/brand'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const MAX_RESULTS = 4
const CATALOG_TTL = 5 * 60_000

/* ------------------------------------------------------------------ *
 * Catalog access (in-memory cache + brand index so a multi-turn      *
 * conversation doesn't refetch or re-scan the whole catalog).        *
 * ------------------------------------------------------------------ */

interface Catalog {
  products: Product[]
  brands: { name: string; lower: string }[]
}

let catalogCache: { data: Catalog; ts: number } | null = null
let inflight: Promise<Catalog> | null = null

function buildCatalog(products: Product[]): Catalog {
  const brands = Array.from(new Set(products.map((p) => p.brand)))
    .map((name) => ({ name, lower: name.toLowerCase() }))
    // Longer brand names first so "WD Black" wins over "WD".
    .sort((a, b) => b.lower.length - a.lower.length)
  return { products, brands }
}

async function getCatalog(): Promise<Catalog> {
  if (catalogCache && Date.now() - catalogCache.ts < CATALOG_TTL) {
    return catalogCache.data
  }
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, { cache: 'no-store' })
      if (!res.ok) return catalogCache?.data ?? buildCatalog([])
      const products: Product[] = await res.json()
      const data = buildCatalog(products)
      catalogCache = { data, ts: Date.now() }
      return data
    } catch {
      return catalogCache?.data ?? buildCatalog([])
    } finally {
      inflight = null
    }
  })()

  return inflight
}

/* ------------------------------------------------------------------ *
 * Helpers                                                            *
 * ------------------------------------------------------------------ */

function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

function toChatProduct(p: Product): ChatProduct {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: p.price,
    rating: p.rating,
    stock: p.stock,
    image: p.images?.[0] ?? '',
  }
}

const CATEGORY_SYNONYMS: Record<string, string> = {
  laptop: 'laptop',
  laptops: 'laptop',
  notebook: 'laptop',
  notebooks: 'laptop',
  ultrabook: 'laptop',
  macbook: 'laptop',
  monitor: 'monitor',
  monitors: 'monitor',
  display: 'monitor',
  displays: 'monitor',
  screen: 'monitor',
  audio: 'audio',
  headphone: 'audio',
  headphones: 'audio',
  earbud: 'audio',
  earbuds: 'audio',
  earphone: 'audio',
  earphones: 'audio',
  headset: 'audio',
  speaker: 'audio',
  speakers: 'audio',
  accessory: 'accessories',
  accessories: 'accessories',
  keyboard: 'accessories',
  keyboards: 'accessories',
  mouse: 'accessories',
  mice: 'accessories',
  webcam: 'accessories',
  dock: 'accessories',
  storage: 'storage',
  ssd: 'storage',
  hdd: 'storage',
  drive: 'storage',
  drives: 'storage',
  nas: 'storage',
}

const CATEGORY_LABEL: Record<string, string> = {
  laptop: 'laptops',
  monitor: 'monitors',
  audio: 'audio gear',
  accessories: 'accessories',
  storage: 'storage',
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'for', 'me', 'i', 'want', 'need', 'needs', 'looking', 'look',
  'show', 'find', 'get', 'some', 'good', 'best', 'please', 'can', 'could',
  'you', 'help', 'with', 'to', 'of', 'and', 'or', 'any', 'my', 'around',
  'about', 'between', 'recommend', 'recommendation', 'suggest', 'suggestion',
  'buy', 'purchase', 'new', 'give', 'list', 'options', 'option', 'product',
  'products', 'something', 'that', 'this', 'is', 'are', 'do', 'have', 'price',
  'priced', 'cheap', 'cheaper', 'cheapest', 'budget', 'affordable', 'premium',
  'rs', 'inr', 'rupees', 'rupee', 'under', 'below', 'over', 'above', 'than',
  'less', 'more', 'within', 'upto', 'up', 'max', 'min', 'great', 'nice',
  'top', 'rated', 'rating', 'quality', 'in', 'on', 'at', 'gift', 'gifts',
  // follow-up / comparison filler so it never pollutes keyword search
  'compare', 'comparison', 'vs', 'versus', 'difference', 'better', 'which',
  'others', 'other', 'else', 'additional', 'these', 'those', 'them', 'one',
  'ones', 'pick', 'picks', 'pricier', 'costlier', 'expensive', 'instead',
  'what', 'whats', 'about', 'see', 'them', 'two', 'three', 'first', 'second',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t))
}

/**
 * Whole-word match — avoids false positives like "phone" inside "headphones"
 * or "pay" inside "display".
 */
function hasWord(text: string, terms: string[]): boolean {
  return terms.some((t) => {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`).test(text)
  })
}

function normalizeAmount(num: string, unit?: string): number {
  let value = parseFloat(num)
  if (!unit) return Math.round(value)
  const u = unit.toLowerCase()
  if (u === 'k') value *= 1_000
  else if (u === 'lakh' || u === 'lac' || u === 'l') value *= 100_000
  return Math.round(value)
}

interface PriceRange {
  min?: number
  max?: number
}

function parsePrice(lower: string): PriceRange {
  const amount = '(\\d+(?:\\.\\d+)?)\\s*(k|lakh|lac|l)?'

  const between = lower.match(
    new RegExp(`between\\s*₹?\\s*${amount}\\s*(?:and|to|-)\\s*₹?\\s*${amount}`),
  )
  if (between && between[1] && between[3]) {
    const a = normalizeAmount(between[1], between[2])
    const b = normalizeAmount(between[3], between[4])
    return { min: Math.min(a, b), max: Math.max(a, b) }
  }

  const max = lower.match(
    new RegExp(
      `(?:under|below|less than|within|upto|up to|max|maximum|budget(?: of)?|cheaper than|no more than)\\s*₹?\\s*${amount}`,
    ),
  )
  const min = lower.match(
    new RegExp(`(?:above|over|more than|at least|minimum|min|starting)\\s*₹?\\s*${amount}`),
  )
  const around = lower.match(new RegExp(`(?:around|about|approx(?:imately)?|~|near)\\s*₹?\\s*${amount}`))

  const range: PriceRange = {}
  if (max && max[1]) range.max = normalizeAmount(max[1], max[2])
  if (min && min[1]) range.min = normalizeAmount(min[1], min[2])
  if (around && around[1] && !max && !min) {
    const center = normalizeAmount(around[1], around[2])
    range.min = Math.round(center * 0.8)
    range.max = Math.round(center * 1.25)
  }
  return range
}

/* ------------------------------------------------------------------ *
 * Product search                                                     *
 * ------------------------------------------------------------------ */

interface SearchOptions {
  forceDeals?: boolean
  /** When true, return no products unless a real filter or keyword matched. */
  strict?: boolean
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

async function productSearch(
  lower: string,
  options: SearchOptions = {},
  context?: ChatContext,
): Promise<ChatReply> {
  const { products, brands } = await getCatalog()

  if (products.length === 0) {
    return {
      text: "I'm having trouble reaching the product catalog right now. Please try again in a moment, or browse the full store directly.",
      suggestions: ['Browse all products', 'Shipping & returns'],
    }
  }

  const tokens = tokenize(lower)

  // --- Detect entities in the current message -----------------------------
  let category: string | undefined
  for (const tok of tokens) {
    if (CATEGORY_SYNONYMS[tok]) {
      category = CATEGORY_SYNONYMS[tok]
      break
    }
  }

  let brand: string | undefined
  for (const b of brands) {
    if (lower.includes(b.lower)) {
      brand = b.name
      break
    }
  }

  const price = parsePrice(lower)

  const wantsCheap = hasAny(lower, ['cheap', 'cheapest', 'affordable', 'budget', 'lowest price', 'least expensive', 'low cost'])
  const wantsPremium = hasAny(lower, ['premium', 'high end', 'high-end', 'flagship', 'expensive', 'top of the line', 'most expensive', 'pricier', 'costlier'])
  const wantsTopRated = hasAny(lower, ['best', 'top rated', 'top-rated', 'highly rated', 'recommend', 'most popular', 'popular'])
  const wantsMore = hasWord(lower, ['more', 'others', 'else', 'additional', 'another']) || lower.includes('show more') || lower.includes('see more')
  const wantsCompare = hasWord(lower, ['compare', 'vs', 'versus']) || lower.includes('which is better') || lower.includes('difference between')

  const brandTokens = brand ? new Set(tokenize(brand)) : new Set<string>()
  const keywords = tokens.filter(
    (t) =>
      t.length > 1 &&
      !STOPWORDS.has(t) &&
      !CATEGORY_SYNONYMS[t] &&
      !brandTokens.has(t) &&
      !/^\d+(\.\d+)?$/.test(t),
  )

  // --- Merge conversation context for follow-ups --------------------------
  // A turn with no fresh subject ("show cheaper", "more", "under 50000",
  // "what about Dell") inherits the previous category/brand/budget.
  const noNewSubject = !category && keywords.length === 0
  const isFollowUp =
    noNewSubject &&
    !!context &&
    (!!context.category || !!context.brand || context.priceMax !== undefined)

  if (isFollowUp && context) {
    if (!category) category = context.category
    if (!brand) brand = context.brand
    const reframingPrice = wantsCheap || wantsPremium
    if (price.min === undefined && price.max === undefined && !reframingPrice) {
      price.min = context.priceMin
      price.max = context.priceMax
    }
  }

  // --- Filter pool --------------------------------------------------------
  let pool = products
  if (category) pool = pool.filter((p) => p.category === category)
  if (brand) pool = pool.filter((p) => p.brand === brand)
  if (price.min !== undefined) pool = pool.filter((p) => p.price >= price.min!)
  if (price.max !== undefined) pool = pool.filter((p) => p.price <= price.max!)

  // Page past already-seen products when the shopper asks for more.
  const exclude = new Set(wantsMore ? context?.shownIds ?? [] : [])

  const scored = pool.map((p) => {
    const haystack = `${p.title} ${p.brand} ${p.description} ${p.category} ${p.tags.join(' ')}`.toLowerCase()
    let score = 0
    for (const kw of keywords) {
      if (haystack.includes(kw)) score += 3
      if (p.title.toLowerCase().includes(kw)) score += 2
    }
    score += p.rating
    if (p.stock === 0) score -= 5
    if (exclude.has(p.id)) score -= 100
    return { product: p, score, matched: keywords.some((kw) => haystack.includes(kw)) }
  })

  const keywordMatched = scored.filter((s) => s.matched)
  const hasFilter =
    !!category ||
    !!brand ||
    price.min !== undefined ||
    price.max !== undefined ||
    keywordMatched.length > 0

  if (options.strict && !options.forceDeals && !hasFilter) {
    return { text: '', products: [] }
  }

  let ranked =
    keywords.length > 0 && keywordMatched.length > 0 && !category && !brand
      ? keywordMatched
      : scored

  // --- Sort ---------------------------------------------------------------
  let sort: ChatSort = 'relevance'
  if (options.forceDeals || wantsCheap) sort = 'price_asc'
  else if (wantsPremium) sort = 'price_desc'

  if (sort === 'price_asc') {
    ranked = [...ranked].sort((a, b) => a.product.price - b.product.price)
  } else if (sort === 'price_desc') {
    ranked = [...ranked].sort((a, b) => b.product.price - a.product.price)
  } else {
    ranked = [...ranked].sort((a, b) => b.score - a.score)
  }

  // Drop excluded (already-shown) items when paging.
  const available = ranked.filter((s) => !exclude.has(s.product.id))
  const limit = wantsCompare ? Math.min(3, MAX_RESULTS) : MAX_RESULTS
  const top = available.slice(0, limit).map((s) => toChatProduct(s.product))

  // Deep-link query for "see all in store"
  const queryParts: string[] = []
  if (keywords.length) queryParts.push(keywords.join(' '))
  else if (brand) queryParts.push(brand)
  const query = queryParts.join(' ').trim() || undefined

  const noun = category ? CATEGORY_LABEL[category] : 'picks'

  // --- Empty result -------------------------------------------------------
  if (top.length === 0) {
    if (wantsMore) {
      return {
        text: `That's everything I've got for that search 🙌 Want me to widen the budget or try a different brand?`,
        suggestions: ['Show cheaper options', 'Show premium picks', "Today's deals"],
        context: { category, brand, priceMin: price.min, priceMax: price.max, sort },
      }
    }
    return {
      text: `I couldn't find ${noun === 'picks' ? 'products' : noun} matching that exact request${
        price.max !== undefined ? ` under ${inr(price.max)}` : ''
      }. Try widening your budget or a different brand — here are a few ideas:`,
      suggestions: ['Best laptops', 'Headphones under ₹20,000', 'Top rated monitors', "Today's best deals"],
    }
  }

  // --- Build reply context for the next turn ------------------------------
  const resultIds = top.map((p) => p.id)
  const replyContext: ChatContext = {
    category,
    brand,
    priceMin: price.min,
    priceMax: price.max,
    sort,
    shownIds: (wantsMore ? [...(context?.shownIds ?? []), ...resultIds] : resultIds).slice(-16),
  }

  // --- Comparison mode ----------------------------------------------------
  if (wantsCompare && top.length >= 2) {
    const lines = top.map(
      (p) => `• ${p.title} — ${inr(p.price)}, ★ ${p.rating}${p.stock === 0 ? ' (out of stock)' : ''}`,
    )
    const byRating = [...top].sort((a, b) => b.rating - a.rating)
    const byPrice = [...top].sort((a, b) => a.price - b.price)
    const topPick = byRating[0]!
    const valuePick = byPrice[0]!
    const verdict =
      topPick.id === valuePick.id
        ? `My pick is the ${topPick.title} — it's both the best-rated and the most affordable here.`
        : `For outright quality I'd go with the ${topPick.title} (★ ${topPick.rating}); if value matters most, the ${valuePick.title} at ${inr(valuePick.price)} is the smart buy.`
    return {
      text: `Here's how they stack up:\n${lines.join('\n')}\n\n${verdict}`,
      products: top,
      suggestions: buildProductSuggestions(category, brand, price, true),
      query,
      context: replyContext,
    }
  }

  // --- Natural-language lead ----------------------------------------------
  const descriptors: string[] = []
  if (wantsTopRated || (sort === 'relevance' && !options.forceDeals)) descriptors.push('top-rated')
  if (brand) descriptors.push(brand)
  const descriptorText = descriptors.length ? `${descriptors.join(' ')} ` : ''

  let lead: string
  if (options.forceDeals) {
    lead = pick([
      `Here are some of the best-value deals in the store right now 🔥`,
      `These are the standout deals worth grabbing today 🔥`,
    ])
  } else if (wantsMore) {
    lead = `A few more ${descriptorText}${noun} you might like:`
  } else if (price.max !== undefined && price.min !== undefined) {
    lead = `Here are some ${descriptorText}${noun} between ${inr(price.min)} and ${inr(price.max)}:`
  } else if (price.max !== undefined) {
    lead = `Here are some great ${descriptorText}${noun} under ${inr(price.max)}:`
  } else if (sort === 'price_asc') {
    lead = `Here are the most affordable ${noun === 'picks' ? 'options' : noun} I found:`
  } else if (sort === 'price_desc') {
    lead = `Here are the premium ${noun === 'picks' ? 'picks' : noun} at the top of our range:`
  } else {
    lead = pick([
      `Here are some ${descriptorText}${noun} I'd recommend:`,
      `Great choice — these ${descriptorText}${noun} are worth a look:`,
      `I found some excellent ${descriptorText}${noun} for you:`,
    ])
  }

  // Add a quick price-range note when it's helpful.
  if (top.length > 1 && sort === 'relevance' && !options.forceDeals) {
    const prices = top.map((p) => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min !== max) lead += `\n\nThey range from ${inr(min)} to ${inr(max)}.`
  }

  return {
    text: lead,
    products: top,
    suggestions: buildProductSuggestions(category, brand, price, top.length >= 2),
    query,
    context: replyContext,
  }
}

function buildProductSuggestions(
  category: string | undefined,
  brand: string | undefined,
  price: PriceRange,
  canCompare = false,
): string[] {
  const out: string[] = []
  if (canCompare) out.push('Compare top 2')
  if (price.max !== undefined) {
    out.push('Show cheaper options')
    out.push('Show premium picks')
  } else if (category) {
    out.push(`Cheapest ${CATEGORY_LABEL[category]}`)
    out.push('Show premium picks')
  } else {
    out.push('Show cheaper options')
    out.push('Best laptops')
  }
  out.push('Show more')
  if (!brand && out.length < 4) out.push('Shipping & returns')
  return out.slice(0, 4)
}

/* ------------------------------------------------------------------ *
 * Knowledge base (orders, shipping, policy, account)                 *
 * ------------------------------------------------------------------ */

const SHOPPING_SUGGESTIONS = ['Recommend a laptop', 'Best headphones', "Today's deals"]

function knowledgeReply(lower: string): ChatReply | null {
  if (hasWord(lower, ['ship', 'shipping', 'delivery', 'deliver', 'arrive', 'dispatch']) || lower.includes('how long')) {
    return {
      text: `We offer free standard shipping on all orders, with delivery in 3–5 business days. Orders placed before 2 PM are dispatched the same day, and you'll get a tracking link by email as soon as your package leaves our warehouse. 📦`,
      suggestions: ['Track my order', 'Return policy', ...SHOPPING_SUGGESTIONS.slice(0, 1)],
    }
  }

  if (hasWord(lower, ['return', 'returns', 'refund', 'exchange']) || lower.includes('send back') || lower.includes('money back')) {
    return {
      text: `You're covered by our 30-day hassle-free return policy. If something isn't right, start a return from your Orders page and we'll arrange a free pickup. Refunds are processed to your original payment method within 5–7 business days. ✅`,
      suggestions: ['Track my order', 'Warranty info', 'Contact support'],
    }
  }

  if (hasWord(lower, ['warranty', 'guarantee', 'damaged', 'defective', 'faulty', 'broken'])) {
    return {
      text: `Every product on ${BRAND_NAME} ships with the full manufacturer warranty (typically 1–2 years), plus our own 30-day satisfaction guarantee. If an item arrives damaged or defective, contact us and we'll replace it right away.`,
      suggestions: ['Return policy', 'Contact support', ...SHOPPING_SUGGESTIONS.slice(0, 1)],
    }
  }

  if (hasWord(lower, ['pay', 'payment', 'payments', 'emi', 'upi', 'cod', 'netbanking', 'wallet']) || lower.includes('cash on delivery') || lower.includes('credit card') || lower.includes('debit card')) {
    return {
      text: `We accept all major credit & debit cards, UPI, net banking, popular wallets, and cash on delivery. No-cost EMI is available on eligible orders above ₹5,000. All payments are securely encrypted. 🔒`,
      suggestions: SHOPPING_SUGGESTIONS,
    }
  }

  if (hasWord(lower, ['track', 'tracking']) || lower.includes('order status') || lower.includes('where is my order') || lower.includes('my order') || lower.includes('cancel order')) {
    return {
      text: `You can view live status for every order — placed, shipped, or delivered — on your Orders page. Sign in to your account, then open "Orders" to see tracking details and line items.`,
      suggestions: ['Shipping info', 'Return policy', 'Contact support'],
      query: undefined,
    }
  }

  if (hasWord(lower, ['login', 'register', 'account', 'password', 'forgot']) || lower.includes('log in') || lower.includes('sign in') || lower.includes('sign up')) {
    return {
      text: `You can sign in or create an account from the account menu in the top bar. Registration uses a quick email OTP verification, and you can reset a forgotten password the same way. Once signed in, you'll have order history, saved addresses, and faster checkout.`,
      suggestions: ['Track my order', ...SHOPPING_SUGGESTIONS.slice(0, 2)],
    }
  }

  if (hasWord(lower, ['contact', 'support', 'human', 'agent', 'email', 'complaint', 'helpline']) || lower.includes('talk to') || lower.includes('speak to') || lower.includes('customer care')) {
    return {
      text: `Happy to point you to a human! You can reach our support team any time at ${SUPPORT_EMAIL}, or use the Contact page for the full form. We typically reply within a few hours.`,
      suggestions: ['Shipping info', 'Return policy', ...SHOPPING_SUGGESTIONS.slice(0, 1)],
    }
  }

  return null
}

/* ------------------------------------------------------------------ *
 * Top-level dispatcher                                               *
 * ------------------------------------------------------------------ */

const PRODUCT_INTENT_WORDS = [
  'recommend', 'suggest', 'show', 'find', 'looking', 'need', 'want', 'buy',
  'best', 'cheap', 'budget', 'under', 'below', 'compare', 'gift', 'options',
  'good', 'top', 'deal', 'deals', 'sale', 'discount',
]

export async function generateReply(
  message: string,
  context?: ChatContext,
): Promise<ChatReply> {
  const text = message.trim()
  const lower = text.toLowerCase()

  if (!text) {
    return {
      text: 'What can I help you find today? You can ask me for product recommendations or about orders, shipping and returns.',
      suggestions: ['Recommend a laptop', 'Best headphones', 'Shipping & returns'],
    }
  }

  // Greetings
  if (
    /^(hi|hii|hey|hello|yo|hola|namaste|good (morning|afternoon|evening)|sup|what's up|whats up)\b/.test(
      lower,
    ) &&
    text.length <= 24
  ) {
    return {
      text: `Hey there! 👋 I'm Nova, your ${BRAND_NAME} shopping assistant. I can help you discover products or answer questions about your order. What are you in the market for?`,
      suggestions: ['Recommend a laptop', 'Best headphones under ₹20,000', "Today's deals"],
    }
  }

  // Thanks
  if (hasWord(lower, ['thank', 'thanks', 'thanx', 'thx', 'appreciate', 'awesome', 'perfect']) && text.length <= 40) {
    return {
      text: "You're very welcome! 😊 Anything else I can help you find?",
      suggestions: SHOPPING_SUGGESTIONS,
    }
  }

  // Capabilities / help
  if (
    hasAny(lower, ['what can you do', 'who are you', 'how can you help', 'help me', 'what do you do', 'capabilities']) ||
    lower === 'help'
  ) {
    return {
      text: `I'm Nova, your AI shopping assistant for ${BRAND_NAME}. I can:\n• Recommend products by category, brand, budget or rating\n• Surface the best deals in the store\n• Answer questions on shipping, returns, warranty, payments and accounts\n\nJust tell me what you're after — e.g. "a gaming laptop under ₹90,000".`,
      suggestions: ['Recommend a laptop', 'Best headphones', "Today's deals", 'Shipping & returns'],
    }
  }

  // Deals / sale
  if (
    hasWord(lower, ['deal', 'deals', 'sale', 'discount', 'discounts', 'offer', 'offers', 'bargain']) &&
    !hasWord(lower, ['under', 'below'])
  ) {
    return productSearch(lower, { forceDeals: true }, context)
  }

  // Follow-up modifiers ("cheaper", "compare", "what about Dell") should
  // continue the previous product search rather than hit the KB. Uses an
  // unambiguous set so KB questions like "tell me more about returns" aren't
  // hijacked (a bare "more" is still handled by the product search fallback).
  const isFollowUpModifier =
    !!context &&
    (!!context.category || !!context.brand || context.priceMax !== undefined) &&
    (hasWord(lower, ['cheaper', 'cheapest', 'pricier', 'costlier', 'premium', 'compare', 'vs', 'versus']) ||
      lower.includes('show more') ||
      lower.includes('see more') ||
      lower.includes('more options') ||
      lower.includes('what about') ||
      lower.includes('how about') ||
      lower.includes('show cheaper') ||
      lower.includes('show premium'))

  // Knowledge base (skipped when the message is clearly a product follow-up)
  if (!isFollowUpModifier) {
    const kb = knowledgeReply(lower)
    if (kb) return kb
  }

  // Product search if there's any shopping intent, a category/brand hint, a
  // price, or a follow-up modifier riding on existing context.
  const looksLikeProduct =
    isFollowUpModifier ||
    hasWord(lower, PRODUCT_INTENT_WORDS) ||
    tokenize(lower).some((t) => CATEGORY_SYNONYMS[t]) ||
    /\d/.test(lower)

  if (looksLikeProduct) {
    return productSearch(lower, {}, context)
  }

  // Last resort: try treating the message as a product keyword search.
  const fallback = await productSearch(lower, { strict: true }, context)
  if (fallback.products && fallback.products.length > 0) {
    return fallback
  }

  return {
    text: `I'm not totally sure I caught that, but I'm great at finding products and answering order questions. Try asking me for a recommendation, or pick one of these:`,
    suggestions: ['Recommend a laptop', 'Best headphones', "Today's deals", 'Shipping & returns'],
  }
}

// Warm the catalog cache on first load so the first message feels instant.
void getCatalog()
