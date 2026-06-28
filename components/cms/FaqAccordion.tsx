'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqItem } from '@/lib/cms/types'

interface Props {
  items: FaqItem[]
}

export function FaqAccordion({ items }: Props) {
  const baseId = useId()
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="faq-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `${baseId}-${item.id}`

        return (
          <div key={item.id} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
            <h2 className="faq-item__heading">
              <button
                type="button"
                id={`${panelId}-btn`}
                className="faq-item__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} className="faq-item__icon" aria-hidden="true" />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-btn`}
              className="faq-item__panel"
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
