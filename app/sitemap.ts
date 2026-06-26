import type { MetadataRoute } from 'next'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cart',
  ]

  const categoryRoutes = PRODUCT_CATEGORIES.map(
    (cat) => `/products?category=${cat}`,
  )

  const now = new Date()

  return [...staticRoutes, ...categoryRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/products' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/products' ? 0.9 : 0.6,
  }))
}
