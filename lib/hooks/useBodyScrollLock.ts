'use client'

import { useEffect } from 'react'

type ScrollLockMode = 'overflow' | 'fixed'

/**
 * Locks page scroll while a modal/drawer is open.
 * `overflow` — best for panels that scroll internally (filters, cart).
 * `fixed` — stronger lock for full-screen overlays.
 */
export function useBodyScrollLock(locked: boolean, mode: ScrollLockMode = 'overflow') {
  useEffect(() => {
    if (!locked) return

    const html = document.documentElement
    const body = document.body

    if (mode === 'overflow') {
      const prevHtml = html.style.overflow
      const prevBody = body.style.overflow
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      return () => {
        html.style.overflow = prevHtml
        body.style.overflow = prevBody
      }
    }

    const scrollY = window.scrollY
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    }

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    return () => {
      body.style.overflow = prev.overflow
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      window.scrollTo(0, scrollY)
    }
  }, [locked, mode])
}
