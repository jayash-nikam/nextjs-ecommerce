import type { Metadata } from 'next'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { CmsSections } from '@/components/cms/CmsSections'
import { CmsRelatedLinks } from '@/components/cms/CmsRelatedLinks'
import {
  CMS_LAST_UPDATED,
  CMS_PAGES,
  shippingSections,
} from '@/lib/cms/content'
import { SUPPORT_EMAIL } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'shipping')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function ShippingPage() {
  return (
    <StaticPageLayout
      title="Shipping & Returns"
      description="Everything you need to know about delivery, returns, and product warranty."
      lastUpdated={CMS_LAST_UPDATED}
    >
      <p>
        We want your order to arrive quickly and hassle-free. If something
        isn&apos;t right, our returns process is designed to be simple.
      </p>
      <CmsSections sections={shippingSections} />
      <p>
        Need help with a specific order? Reach out at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>{' '}
        or visit our{' '}
        <a href="/faq" className="text-primary hover:underline">
          FAQ
        </a>
        .
      </p>
      <CmsRelatedLinks exclude={['shipping']} slugs={['faq', 'contact', 'terms']} />
    </StaticPageLayout>
  )
}
