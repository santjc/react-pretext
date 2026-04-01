import { useState } from 'react'
import { createPretextTypography, useMeasuredText, useTruncatedText } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { PLAYGROUND_FONT_FAMILY, fontWeightOptions } from '../lib/typography'

const coreTabs = [
  { id: 'measure', label: 'Measure' },
  { id: 'scroll-height', label: 'ScrollHeight' },
  { id: 'truncate', label: 'Truncate' },
] as const

type CoreTabId = (typeof coreTabs)[number]['id']

const initialText = 'Prepare once, layout often. That is the shape of the abstraction this package should preserve.'
const coreAccordionSections = [
  {
    id: 'predictable-heights',
    title: 'Predictable heights before paint',
    body: 'Pretext lets the accordion know the exact text height from width, font, and line height alone. The open state does not need a hidden measuring node, a layout read, or guesswork tied to scrollHeight.',
  },
  {
    id: 'cheap-resize',
    title: 'Cheap width-driven relayout',
    body: 'Resize the panel and the content height updates immediately from the same prepared text handle. Width changes stay in the arithmetic path instead of bouncing through DOM measurement on every frame.',
  },
  {
    id: 'same-dom',
    title: 'Real semantic DOM stays intact',
    body: 'The rendered content can still be a normal paragraph. Pretext does the prediction work, while the browser keeps the accessible DOM you actually want to ship inside the accordion body.',
  },
] as const
const truncationSamples = [
  'Pretext lets result cards show a fixed teaser length without guessing where the browser will wrap the body copy.',
  'The same measurement model can drive previews, compact list rows, read-more affordances, and card placement without DOM reads.',
  'Accurate truncation matters most when line count changes layout, not just when you want a visual clamp.',
] as const

const BUBBLE_HORIZONTAL_CHROME = 36

function getBubbleRenderWidth(contentWidth: number) {
  return contentWidth + BUBBLE_HORIZONTAL_CHROME
}

function getBubbleStyle(typography: ReturnType<typeof createPretextTypography>) {
  return {
    ...typography.style,
    width: `${getBubbleRenderWidth(typography.width ?? 0)}px`,
  }
}

function CoreAccordionSection({
  title,
  body,
  isOpen,
  onToggle,
  typography,
}: {
  title: string
  body: string
  isOpen: boolean
  onToggle: () => void
  typography: ReturnType<typeof createPretextTypography>
}) {
  const metrics = useMeasuredText({ text: body, typography })

  return (
    <article className={`accordion-item${isOpen ? ' accordion-item-open' : ''}`}>
      <button type="button" className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <strong>{isOpen ? '−' : '+'}</strong>
      </button>

      <div className="accordion-measure-row">
        <span>{metrics.lineCount} lines</span>
        <span>{metrics.height}px predicted</span>
      </div>

      <div className="accordion-body-shell" style={{ height: isOpen ? `${metrics.height + 24}px` : '0px' }}>
        <div className="accordion-body-inner">
          <p className="accordion-body-copy" style={typography.style}>
            {body}
          </p>
        </div>
      </div>
    </article>
  )
}

function CorePage() {
  const [activeTab, setActiveTab] = useState<CoreTabId>('measure')
  const [text, setText] = useState(initialText)
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const [openSectionId, setOpenSectionId] = useState<string>(coreAccordionSections[0].id)
  const [truncationText, setTruncationText] = useState<string>(truncationSamples[0])
  const [maxLines, setMaxLines] = useState(3)
  const [ellipsis, setEllipsis] = useState('…')

  const typography = createPretextTypography({
    family: PLAYGROUND_FONT_FAMILY,
    size: fontSize,
    weight: fontWeight,
    lineHeight,
    width,
  })
  const measured = useMeasuredText({
    text,
    typography,
    enableProfiling: activeTab === 'measure',
  })
  const scrollHeightTypography = createPretextTypography({
    family: PLAYGROUND_FONT_FAMILY,
    size: fontSize,
    weight: 400,
    lineHeight,
    width: Math.max(0, width - 48),
  })
  const truncationTypography = createPretextTypography({
    family: PLAYGROUND_FONT_FAMILY,
    size: 16,
    weight: 400,
    lineHeight: 24,
    width: 280,
  })
  const fullTruncationMetrics = useMeasuredText({ text: truncationText, typography: truncationTypography })
  const truncated = useTruncatedText({
    text: truncationText,
    typography: truncationTypography,
    maxLines,
    ellipsis,
  })

  const tabMeta =
    activeTab === 'measure'
      ? {
          title: 'Measure text with one shared typography object',
          description: 'Start with the smallest story in the package: define typography once, call useMeasuredText(), and use the returned height and line count in ordinary component logic.',
          status: 'Start here',
        }
      : activeTab === 'scroll-height'
          ? {
              title: 'Replace scrollHeight reads with predicted height',
              description: 'This is the migration path for normal UI: use measured text height before a panel opens instead of reading scrollHeight after render.',
              status: 'Migration',
            }
          : {
              title: 'Truncate to a known line budget before render',
              description: 'useTruncatedText() gives you the visible text, line counts, and height you need for snippets, teasers, compact rows, and read-more UI.',
              status: 'New hook',
            }

  return (
    <main className="page showcase-page">
      <ShowcaseIntro eyebrow="Core path" title={tabMeta.title} description={tabMeta.description} status={tabMeta.status} />

      <section className="panel display-panel core-tabs-shell">
        <div className="segmented-control segmented-control-core" role="tablist" aria-label="Core path sections">
          {coreTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTab}
              className={tab.id === activeTab ? 'segmented-control-button active' : 'segmented-control-button'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="showcase-grid">
          <aside className="panel controls-panel">
            {activeTab === 'measure' ? (
              <>
                <label className="field">
                  <span>Text</span>
                  <textarea value={text} rows={7} onChange={(event) => setText(event.target.value)} />
                </label>
                <label className="field">
                  <span>Width: {width}px</span>
                  <input type="range" min="180" max="560" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
                </label>
                <label className="field">
                  <span>Font size: {fontSize}px</span>
                  <input type="range" min="12" max="40" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
                </label>
                <label className="field">
                  <span>Line height: {lineHeight}px</span>
                  <input type="range" min="16" max="56" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
                </label>
                <label className="field">
                  <span>Font weight</span>
                  <select value={fontWeight} onChange={(event) => setFontWeight(Number(event.target.value))}>
                    {fontWeightOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="note-card">
                  <p className="eyebrow eyebrow-muted">Shared typography</p>
                  <p className="page-copy">The same <code>typography</code> object feeds measurement and render output, so width, font, and line height do not drift apart.</p>
                </div>
              </>
            ) : null}

            {activeTab === 'scroll-height' ? (
              <>
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
                  <p className="eyebrow eyebrow-muted">Why this matters</p>
                  <p className="page-copy">Each panel gets a predicted height before it opens. That removes hidden probes and DOM reads tied to <code>scrollHeight</code> while keeping real semantic paragraphs inside the accordion.</p>
                </div>
              </>
            ) : null}

            {activeTab === 'truncate' ? (
              <>
                <label className="field">
                  <span>Preview text</span>
                  <textarea value={truncationText} rows={8} onChange={(event) => setTruncationText(event.target.value)} />
                </label>
                <label className="field">
                  <span>Max lines: {maxLines}</span>
                  <input type="range" min="1" max="5" step="1" value={maxLines} onChange={(event) => setMaxLines(Number(event.target.value))} />
                </label>
                <label className="field">
                  <span>Ellipsis token</span>
                  <input type="text" value={ellipsis} onChange={(event) => setEllipsis(event.target.value)} />
                </label>
                <div className="preset-row">
                  {truncationSamples.map((sample) => (
                    <button key={sample} type="button" className={sample === truncationText ? 'mini-chip active' : 'mini-chip'} onClick={() => setTruncationText(sample)}>
                      Sample
                    </button>
                  ))}
                </div>
                <div className="note-card">
                  <p className="eyebrow eyebrow-muted">Built for previews</p>
                  <p className="page-copy">This hook is for snippets, teasers, compact rows, collapsed bodies, and any place where the visible text itself must be deterministic before render.</p>
                </div>
              </>
            ) : null}
          </aside>

          <section className="panel display-panel">
            {activeTab === 'measure' ? (
              <>
                <div className="metrics-inline">
                  <div className="metric-box"><span>Prepare</span><strong>{measured.prepareMs?.toFixed(3) ?? 'off'}</strong></div>
                  <div className="metric-box"><span>Lines</span><strong>{measured.lineCount}</strong></div>
                  <div className="metric-box"><span>Height</span><strong>{measured.height}px</strong></div>
                </div>

                <div className="core-bubble-wrap" style={{ maxWidth: `${getBubbleRenderWidth(width)}px` }}>
                  <p className="preview-copy" style={getBubbleStyle(typography)}>
                    {text}
                  </p>
                </div>

                <pre className="code-block">{`const typography = createPretextTypography({
  family: 'GeistVariable, sans-serif',
  size: ${fontSize},
  weight: ${fontWeight},
  lineHeight: ${lineHeight},
  width: ${width},
})

const { height, lineCount } = useMeasuredText({ text, typography })`}</pre>
              </>
            ) : null}

            {activeTab === 'scroll-height' ? (
              <>
                <div className="metrics-inline">
                  <div className="metric-box"><span>Sections</span><strong>{coreAccordionSections.length}</strong></div>
                  <div className="metric-box"><span>Width</span><strong>{width}px</strong></div>
                  <div className="metric-box"><span>Open</span><strong>{coreAccordionSections.findIndex((section) => section.id === openSectionId) + 1}</strong></div>
                </div>

                <div className="accordion-stage" style={{ width: `${width}px` }}>
                  {coreAccordionSections.map((section) => (
                    <CoreAccordionSection
                      key={section.id}
                      title={section.title}
                      body={section.body}
                      isOpen={section.id === openSectionId}
                      onToggle={() => setOpenSectionId((current) => (current === section.id ? '' : section.id))}
                      typography={scrollHeightTypography}
                    />
                  ))}
                </div>

                <pre className="code-block">{`const typography = createPretextTypography({
  family: 'GeistVariable, sans-serif',
  size: ${fontSize},
  weight: 400,
  lineHeight: ${lineHeight},
  width: ${Math.max(0, width - 48)},
})

const { height } = useMeasuredText({ text, typography })

<div style={{ height: isOpen ? \`${'${height}'}px\` : '0px' }} />`}</pre>
              </>
            ) : null}

            {activeTab === 'truncate' ? (
              <>
                <div className="metrics-inline">
                  <div className="metric-box"><span>Full lines</span><strong>{fullTruncationMetrics.lineCount}</strong></div>
                  <div className="metric-box"><span>Visible lines</span><strong>{truncated.visibleLineCount}</strong></div>
                  <div className="metric-box"><span>Height</span><strong>{truncated.height}px</strong></div>
                  <div className="metric-box"><span>Truncated</span><strong>{truncated.didTruncate ? 'yes' : 'no'}</strong></div>
                </div>

                <div className="compare-grid compare-grid-stacked">
                  <article className="panel compare-column compare-column-soft">
                    <div className="example-head">
                      <div>
                        <p className="eyebrow eyebrow-muted">Full text</p>
                        <h3 className="example-title">Original copy before truncation</h3>
                      </div>
                      <span className="status-tag status-tag-muted">{fullTruncationMetrics.height}px</span>
                    </div>
                    <div className="core-bubble-wrap">
                      <p className="bubble bubble-css" style={getBubbleStyle(truncationTypography)}>
                        {truncationText}
                      </p>
                    </div>
                  </article>

                  <article className="panel compare-column compare-column-accent">
                    <div className="example-head">
                      <div>
                        <p className="eyebrow">Truncated preview</p>
                        <h3 className="example-title">Deterministic teaser text within a line budget</h3>
                      </div>
                      <div className="compare-meta">
                        <span className="status-tag">{truncated.visibleLineCount}/{truncated.fullLineCount} lines</span>
                      </div>
                    </div>
                    <div className="core-bubble-wrap core-truncate-lane">
                      <p className="bubble bubble-accent" style={getBubbleStyle(truncationTypography)}>
                        {truncated.text}
                      </p>
                      {truncated.didTruncate ? <button type="button" className="mini-chip core-inline-action">Read more</button> : null}
                    </div>
                  </article>
                </div>

                <pre className="code-block">{`const preview = useTruncatedText({
  text,
  typography,
  maxLines: ${maxLines},
  ellipsis: ${JSON.stringify(ellipsis)},
})

preview.text
preview.didTruncate
preview.visibleLineCount
preview.fullLineCount
preview.height`}</pre>
              </>
            ) : null}
          </section>
        </section>
      </section>
    </main>
  )
}

export { CorePage }
