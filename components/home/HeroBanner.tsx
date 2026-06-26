import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap } from 'lucide-react'
import { BRAND_NAME } from '@/lib/brand'

export function HeroBanner() {
  return (
    <section className="relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] overflow-hidden">
      <div className="relative min-h-[480px] sm:min-h-[560px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-accent/80 to-indigo-900" />
        <Image
          src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1600"
          alt="Modern workspace with laptop and tech accessories"
          fill
          className="object-cover opacity-20 mix-blend-overlay"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <Zap size={14} fill="currentColor" />
              {BRAND_NAME} — Premium Tech Deals
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Premium tech,{' '}
              <span className="text-white/90">curated for you</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-xl">
              Discover laptops, audio, monitors and more — handpicked with
              intelligent recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 shadow-lg transition-all hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/products?sort=rating_desc"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Top Rated
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
