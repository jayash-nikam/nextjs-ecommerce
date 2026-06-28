'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'

const CART_TRIGGER_ID = 'cart-trigger'

function getCartAnchorStyle(): React.CSSProperties {
  const cart = document.getElementById(CART_TRIGGER_ID)
  if (!cart) {
    return { top: 16, right: 16 }
  }

  const rect = cart.getBoundingClientRect()
  return {
    top: rect.bottom + 10,
    right: Math.max(12, window.innerWidth - rect.right),
  }
}

export function Toast() {
  const message = useToastStore((state) => state.message)
  const hide = useToastStore((state) => state.hide)
  const [position, setPosition] = useState<React.CSSProperties>({ top: 16, right: 16 })

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(hide, 3000)
    return () => clearTimeout(timer)
  }, [message, hide])

  useEffect(() => {
    if (!message) return

    function updatePosition() {
      setPosition(getCartAnchorStyle())
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [message])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={position}
      className="toast-pop fixed z-[110] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border shadow-card-hover text-sm font-medium max-w-[min(20rem,calc(100vw-1.5rem))]"
    >
      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  )
}
