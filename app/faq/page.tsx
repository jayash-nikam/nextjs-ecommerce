import type { Metadata } from 'next'
import Link from 'next/link'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { FaqAccordion } from '@/components/cms/FaqAccordion'
import { CmsRelatedLinks } from '@/components/cms/CmsRelatedLinks'
import { CMS_PAGES, faqItems } from '@/lib/cms/content'
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'faq')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function FaqPage() {
  return (
    <StaticPageLayout
      title="Frequently Asked Questions"
      description={`Quick answers about shopping, orders, and support at ${BRAND_NAME}.`}
    >
      <p>
        Can&apos;t find what you need?{' '}
        <Link href="/contact" className="text-primary hover:underline font-medium">
          Contact us
        </Link>{' '}
        or email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <FaqAccordion items={faqItems} />
      <CmsRelatedLinks exclude={['faq']} slugs={['shipping', 'contact', 'privacy', 'terms']} />
    </StaticPageLayout>
  )
}
