import type { Metadata } from 'next'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { CmsSections } from '@/components/cms/CmsSections'
import { CmsRelatedLinks } from '@/components/cms/CmsRelatedLinks'
import {
  CMS_LAST_UPDATED,
  CMS_PAGES,
  cookieSections,
} from '@/lib/cms/content'
import { PRIVACY_EMAIL } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'cookies')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function CookiesPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      description="How we use cookies and similar technologies on this site."
      lastUpdated={CMS_LAST_UPDATED}
    >
      <p>
        This policy describes the cookies and local storage used by our
        storefront to provide core functionality such as your cart, sign-in
        session, and preferences.
      </p>
      <CmsSections sections={cookieSections} />
      <p>
        For broader data practices, see our{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        . Questions:{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
          {PRIVACY_EMAIL}
        </a>
        .
      </p>
      <CmsRelatedLinks exclude={['cookies']} />
    </StaticPageLayout>
  )
}
