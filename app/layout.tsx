import type { Metadata, Viewport } from 'next'
import '../styles/globals.scss'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { AppShell } from '@/components/layout/AppShell'
import { Toast } from '@/components/ui/Toast'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'
import { SITE_URL, defaultOpenGraph } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Premium Tech & Electronics Online`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
  keywords: [
    'tech shop',
    'laptops online',
    'electronics store',
    'headphones',
    'monitors',
    'India',
    BRAND_NAME,
  ],
  openGraph: {
    ...defaultOpenGraph,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultOpenGraph.title,
    description: defaultOpenGraph.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans text-foreground antialiased min-h-screen flex flex-col">
        <Suspense fallback={<div className="min-h-screen" />}>
          <AppShell>{children}</AppShell>
        </Suspense>
        <Toast />
      </body>
    </html>
  )
}
