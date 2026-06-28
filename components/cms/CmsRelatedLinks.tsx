import Link from 'next/link'
import { CMS_PAGES } from '@/lib/cms/content'

interface Props {
  /** Slugs to exclude (current page). */
  exclude?: string[]
  slugs?: string[]
}

export function CmsRelatedLinks({ exclude = [], slugs }: Props) {
  const links = (slugs
    ? CMS_PAGES.filter((p) => slugs.includes(p.slug))
    : CMS_PAGES.filter((p) => p.footerGroup === 'legal' || p.slug === 'faq')
  ).filter((p) => !exclude.includes(p.slug))

  if (links.length === 0) return null

  return (
    <nav className="cms-links" aria-label="Related pages">
      {links.map((page) => (
        <Link key={page.slug} href={page.href}>
          {page.navLabel}
        </Link>
      ))}
    </nav>
  )
}
