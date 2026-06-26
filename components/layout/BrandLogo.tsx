import Link from 'next/link'
import { Zap } from 'lucide-react'
import { BRAND_NAME } from '@/lib/brand'

interface Props {
  showName?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function BrandLogo({ showName = true, size = 'md', className = '' }: Props) {
  const iconSize = size === 'sm' ? 16 : 18
  const boxClass = size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl'
  const textClass = size === 'sm' ? 'text-base' : 'text-lg'

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 font-bold tracking-tight ${className}`}
    >
      <span
        className={`flex items-center justify-center ${boxClass} bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
      >
        <Zap size={iconSize} fill="currentColor" />
      </span>
      {showName && (
        <span className={`hidden sm:inline header-logo-text ${textClass}`}>
          {BRAND_NAME}
        </span>
      )}
    </Link>
  )
}
