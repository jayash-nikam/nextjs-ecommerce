export interface CmsSection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface CmsPageMeta {
  slug: string
  href: string
  title: string
  description: string
  navLabel: string
  /** Footer column: company | support | legal */
  footerGroup: 'company' | 'support' | 'legal'
}
