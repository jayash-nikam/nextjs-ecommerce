import type { Metadata } from 'next'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { CmsSections } from '@/components/cms/CmsSections'
import { CmsRelatedLinks } from '@/components/cms/CmsRelatedLinks'
import {
  CMS_LAST_UPDATED,
  CMS_PAGES,
  termsSections,
} from '@/lib/cms/content'
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'terms')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      description={`Rules and guidelines for using ${BRAND_NAME}.`}
      lastUpdated={CMS_LAST_UPDATED}
    >
      <p>
        Please read these terms carefully before using our store. By placing an
        order or creating an account, you agree to be bound by them.
      </p>
      <CmsSections sections={termsSections} />
      <p>
        Questions about these terms? Contact{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <CmsRelatedLinks exclude={['terms']} />
    </StaticPageLayout>
  )
}
