import Link from 'next/link'

interface Props {
  title: string
  description?: string
  lastUpdated?: string
  children: React.ReactNode
}

export function StaticPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: Props) {
  return (
    <div className="animate-fade-in-up static-page">
      <header className="mb-10">
        <h1 className="static-page__title">
          {title}
        </h1>
        {description && (
          <p className="text-muted text-lg leading-relaxed">{description}</p>
        )}
        {lastUpdated && (
          <p className="cms-meta">Last updated: {lastUpdated}</p>
        )}
      </header>
      <div className="prose prose-neutral max-w-none space-y-4 text-muted leading-relaxed">
        {children}
      </div>
      <p className="mt-10">
        <Link href="/" className="text-primary hover:underline font-medium">
          ← Back to home
        </Link>
      </p>
    </div>
  )
}
