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

  return (
    <div className="space-y-4">
      <div className="card-surface p-3 relative">
        <div
          ref={containerRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-border-subtle cursor-crosshair group"
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
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
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
              <ZoomIn size={12} />
              Hover to zoom
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
              {active + 1} / {gallery.length}
            </div>
          </div>
        </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`
                relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden
                border-2 transition-all duration-200
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
      )}
    </div>
  )
}
