'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface LinkItem {
  href: string
  label: string
}

interface Props {
  title: string
  links: LinkItem[]
  defaultOpen?: boolean
}

export function FooterAccordion({ title, links, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className={`footer-accordion lg:border-none${open ? ' footer-accordion--open' : ''}`}>
      <button
        type="button"
        className="footer-accordion__trigger lg:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <ChevronDown size={18} className="footer-accordion__icon" aria-hidden="true" />
      </button>

      <h3 className="hidden lg:block text-sm font-semibold mb-4 footer-heading">{title}</h3>

      <div
        id={panelId}
        className="footer-accordion__panel lg:!block lg:!pb-0"
        hidden={!open}
      >
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm footer-link block py-0.5">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
