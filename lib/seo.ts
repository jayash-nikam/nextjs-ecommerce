import { BRAND_NAME, BRAND_TAGLINE, BRAND_DOMAIN } from '@/lib/brand'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || `https://${BRAND_DOMAIN}`

export const defaultOpenGraph = {
  type: 'website' as const,
  locale: 'en_IN',
  siteName: BRAND_NAME,
  title: `${BRAND_NAME} — Premium Tech & Electronics Online`,
  description: BRAND_TAGLINE,
}
