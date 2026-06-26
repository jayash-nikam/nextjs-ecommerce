import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${BRAND_NAME} and our mission.`,
}

export default function AboutPage() {
  return (
    <StaticPageLayout
      title={`About ${BRAND_NAME}`}
      description={BRAND_TAGLINE}
    >
      <p>
        {BRAND_NAME} is a modern online tech store built to help you discover
        premium technology products — from laptops and monitors to audio gear
        and accessories.
      </p>
      <p>
        We combine a curated catalog of 100+ products with smart search and
        filtering so you can find exactly what you need, faster.
      </p>
      <p>
        Our mission is to make tech shopping simple, transparent, and enjoyable
        for everyone.
      </p>
    </StaticPageLayout>
  )
}
