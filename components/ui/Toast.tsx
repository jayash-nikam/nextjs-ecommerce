'use client'

import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'

export function Toast() {
  const message = useToastStore((state) => state.message)
  const hide = useToastStore((state) => state.hide)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(hide, 3000)
    return () => clearTimeout(timer)
  }, [message, hide])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border shadow-card-hover text-sm font-medium"
    >
      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
