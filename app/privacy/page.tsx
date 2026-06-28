import type { Metadata } from 'next'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { CmsSections } from '@/components/cms/CmsSections'
import { CmsRelatedLinks } from '@/components/cms/CmsRelatedLinks'
import {
  CMS_LAST_UPDATED,
  CMS_PAGES,
  privacySections,
} from '@/lib/cms/content'
import { PRIVACY_EMAIL } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'privacy')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information."
      lastUpdated={CMS_LAST_UPDATED}
    >
      <p>
        {meta.description} This policy explains what data we handle when you
        shop, create an account, or contact support.
      </p>
      <CmsSections sections={privacySections} />
      <p>
        For privacy-related requests, email{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
      <CmsRelatedLinks exclude={['privacy']} />
    </StaticPageLayout>
  )
}
