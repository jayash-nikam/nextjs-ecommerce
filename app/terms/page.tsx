import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { BRAND_NAME } from '@/lib/brand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `${BRAND_NAME} terms of service.`,
}

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>
        By using {BRAND_NAME}, you agree to these terms. Products listed are subject
        to availability. Prices and descriptions are provided for informational
        purposes and may change without notice.
      </p>
      <p>
        Returns are accepted within 7 days of delivery for unused items in
        original packaging. Warranty coverage varies by product and manufacturer.
      </p>
      <p>
        {BRAND_NAME} is provided as-is for demonstration purposes. Full terms will
        apply when checkout and payment features launch.
      </p>
    </StaticPageLayout>
  )
}
