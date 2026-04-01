import { useMemo, useState } from 'react'
import { PText, createPretextTypography, prepare, usePretextLayout } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { buildPlaygroundFont } from '../lib/typography'

const sections = [
  {
    id: 'predictable-heights',
    title: 'Predictable heights before paint',
    body:
      'Pretext lets the accordion know the exact text height from width, font, and line height alone. The open state does not need a hidden measuring node, a layout read, or guesswork tied to scrollHeight.',
  },
  {
    id: 'cheap-resize',
    title: 'Cheap width-driven relayout',
    body:
      'Resize the panel and the content height updates immediately from the same prepared text handle. Width changes stay in the arithmetic path instead of bouncing through DOM measurement on every frame.',
  },
  {
    id: 'same-dom',
    title: 'Real semantic DOM stays intact',
    body:
      'The rendered content can still be a normal paragraph. Pretext does the prediction work, while the browser keeps the accessible DOM you actually want to ship inside the accordion body.',
  },
] as const

function AccordionSection({
  title,
  body,
  isOpen,
  onToggle,
  width,
  font,
  lineHeight,
}: {
  title: string
  body: string
  isOpen: boolean
  onToggle: () => void
  width: number
  font: string
  lineHeight: number
}) {
  const bodyWidth = Math.max(0, width - 48)
  const typography = createPretextTypography({ font, lineHeight, width: bodyWidth })
  const prepared = useMemo(() => prepare(body, typography.font), [body, typography.font])
  const metrics = usePretextLayout({ prepared, width: typography.width ?? bodyWidth, lineHeight: typography.lineHeight })
  const contentHeight = metrics.height

  return (
    <article className={`accordion-item${isOpen ? ' accordion-item-open' : ''}`}>
      <button type="button" className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <strong>{isOpen ? '−' : '+'}</strong>
      </button>

      <div className="accordion-measure-row">
        <span>{metrics.lineCount} lines</span>
        <span>{contentHeight}px predicted</span>
      </div>

      <div className="accordion-body-shell" style={{ height: isOpen ? `${contentHeight + 24}px` : '0px' }}>
        <div className="accordion-body-inner">
          <PText
            as="p"
            typography={typography}
            className="accordion-body-copy"
          >
            {body}
          </PText>
        </div>
      </div>
    </article>
  )
}

function AccordionPage() {
  const [width, setWidth] = useState(520)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(30)
  const [openSectionId, setOpenSectionId] = useState<string>(sections[0].id)
  const font = buildPlaygroundFont(400, fontSize)

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Accordion"
        title="Accordions with known text height"
        description="Expand and collapse sections whose open heights come from Pretext instead of DOM measurement or hidden probe nodes."
        status="Stable API"
      />

      <section className="showcase-grid">
        <aside className="panel controls-panel">
          <label className="field">
            <span>Accordion width: {width}px</span>
            <input type="range" min="320" max="760" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Body size: {fontSize}px</span>
            <input type="range" min="14" max="24" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Body leading: {lineHeight}px</span>
            <input type="range" min="20" max="38" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
          </label>
          <div className="note-card">
            <p className="eyebrow eyebrow-muted">Why it matters</p>
            <p className="page-copy">The open panel height is predictable before the section animates, so the resize path stays in JavaScript text layout instead of DOM reads.</p>
          </div>
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Sections</span><strong>{sections.length}</strong></div>
            <div className="metric-box"><span>Width</span><strong>{width}px</strong></div>
            <div className="metric-box"><span>Open</span><strong>{sections.findIndex((section) => section.id === openSectionId) + 1}</strong></div>
          </div>

          <div className="accordion-stage" style={{ width: `${width}px` }}>
            {sections.map((section) => (
              <AccordionSection
                key={section.id}
                title={section.title}
                body={section.body}
                isOpen={section.id === openSectionId}
                onToggle={() => setOpenSectionId((current) => (current === section.id ? '' : section.id))}
                width={width}
                font={font}
                lineHeight={lineHeight}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export { AccordionPage }
