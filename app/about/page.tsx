import type { Metadata } from 'next'
import { StaticPageLayout } from '@/components/layout/StaticPageLayout'
import { CmsSections } from '@/components/cms/CmsSections'
import {
  aboutDescription,
  aboutIntro,
  aboutSections,
  CMS_PAGES,
} from '@/lib/cms/content'
import { BRAND_NAME } from '@/lib/brand'

const meta = CMS_PAGES.find((p) => p.slug === 'about')!

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
}

export default function AboutPage() {
  return (
    <StaticPageLayout
      title={`About ${BRAND_NAME}`}
      description={aboutDescription}
    >
      {aboutIntro.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
      <CmsSections sections={aboutSections} />
    </StaticPageLayout>
  )
}
