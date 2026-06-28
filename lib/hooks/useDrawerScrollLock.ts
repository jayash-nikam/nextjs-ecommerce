'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Prevents background scroll while a drawer is open, but allows touch scrolling
 * inside `scrollRef` (required for iOS Safari filter panels).
 */
export function useDrawerScrollLock(
  locked: boolean,
  scrollRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!locked) return

    const scrollEl = scrollRef.current
    const body = document.body
    body.classList.add('drawer-scroll-lock')

    function canScroll(el: HTMLElement, deltaY: number): boolean {
      if (el.scrollHeight <= el.clientHeight) return false
      if (deltaY < 0 && el.scrollTop > 0) return true
      if (deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight) return true
      return false
    }

    function findScrollableAncestor(node: HTMLElement | null): HTMLElement | null {
      let current = node
      while (current) {
        if (current === scrollEl) return scrollEl
        const style = window.getComputedStyle(current)
        const oy = style.overflowY
        if (
          (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
          current.scrollHeight > current.clientHeight
        ) {
          return current
        }
        current = current.parentElement
      }
      return null
    }

    let lastY = 0

    function onTouchStart(e: TouchEvent) {
      lastY = e.touches[0]?.clientY ?? 0
    }

    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY ?? 0
      const deltaY = lastY - y
      lastY = y

      const target = e.target as HTMLElement | null
      if (!target) {
        e.preventDefault()
        return
      }

      if (scrollEl?.contains(target)) {
        const scrollable = findScrollableAncestor(target)
        if (scrollable && canScroll(scrollable, deltaY)) return
        if (scrollEl && canScroll(scrollEl, deltaY)) return
      }

      e.preventDefault()
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      body.classList.remove('drawer-scroll-lock')
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [locked, scrollRef])
}
