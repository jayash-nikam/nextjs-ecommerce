'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const gallery = images.length > 0 ? images : ['/placeholder.png']
  const [active, setActive] = useState(0)
  const [zooming, setZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const currentImage = gallery[active] ?? gallery[0] ?? '/placeholder.png'

  function prev() {
    setActive((i) => (i === 0 ? gallery.length - 1 : i - 1))
  }

  function next() {
    setActive((i) => (i === gallery.length - 1 ? 0 : i + 1))
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = {
      x: e.touches[0]?.clientX ?? 0,
      y: e.touches[0]?.clientY ?? 0,
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || gallery.length <= 1) return
    const touch = e.changedTouches[0]
    if (!touch) return

    const dx = touch.clientX - touchStart.current.x
    const dy = touch.clientY - touchStart.current.y

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      if (dx > 0) prev()
      else next()
    }

    touchStart.current = null
  }

  function handleTapZoom(e: React.TouchEvent) {
    if (!containerRef.current) return
    const touch = e.changedTouches[0]
    if (!touch) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    if (zooming) {
      setZooming(false)
      return
    }

    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
    setZooming(true)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="card-surface p-2 sm:p-3 relative">
        <div
          ref={containerRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-border-subtle lg:cursor-crosshair group"
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => {
            const start = touchStart.current
            handleTouchEnd(e)
            if (start) {
              const touch = e.changedTouches[0]
              if (touch) {
                const dx = Math.abs(touch.clientX - start.x)
                const dy = Math.abs(touch.clientY - start.y)
                if (dx < 10 && dy < 10) handleTapZoom(e)
              }
            }
          }}
        >
          <Image
            src={currentImage}
            alt={`${title} - image ${active + 1}`}
            fill
            className={`object-cover transition-transform duration-200 ease-out ${
              zooming ? 'scale-[2]' : 'scale-100'
            }`}
            style={
              zooming
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="gallery-nav-btn gallery-nav-btn--prev opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                className="gallery-nav-btn gallery-nav-btn--next opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            <ZoomIn size={12} />
            Hover to zoom
          </div>
          <div className="absolute bottom-3 left-3 flex sm:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            <ZoomIn size={12} />
            Tap to zoom
          </div>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {active + 1} / {gallery.length}
          </div>
        </div>
      </div>

      {gallery.length > 1 && (
        <>
          <div className="gallery-dots sm:hidden">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`gallery-dot${i === active ? ' gallery-dot--active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>

          <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 responsive-scroll">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                className={`
                  relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden
                  border-2 transition-all duration-200 touch-target
                  ${
                    i === active
                      ? 'border-primary shadow-glow scale-105'
                      : 'border-border opacity-70 hover:opacity-100 hover:border-primary/40'
                  }
                `}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
