import type { CmsSection } from '@/lib/cms/types'

interface Props {
  sections: CmsSection[]
}

export function CmsSections({ sections }: Props) {
  return (
    <div className="cms-sections">
      {sections.map((section) => (
        <section key={section.id} className="cms-section" aria-labelledby={`cms-${section.id}`}>
          <h2 id={`cms-${section.id}`} className="cms-section__title">
            {section.title}
          </h2>
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="cms-section__list">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
