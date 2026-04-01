import { useState } from 'react'
import { PText, createPretextTypography, usePreparedText, usePretextLayout } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { buildPlaygroundFont, fontWeightOptions } from '../lib/typography'

const initialText = 'Prepare once, layout often. That is the shape of the abstraction this package should preserve.'

function MeasurePage() {
  const [text, setText] = useState(initialText)
  const [width, setWidth] = useState(360)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(30)
  const [fontWeight, setFontWeight] = useState(400)
  const typography = createPretextTypography({
    font: buildPlaygroundFont(fontWeight, fontSize),
    lineHeight,
    width,
  })

  const { prepared, prepareMs } = usePreparedText({ text, font: typography.font, enableProfiling: true })
  const layout = usePretextLayout({
    prepared,
    width: typography.width ?? width,
    lineHeight: typography.lineHeight,
  })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Measurement"
        title="Measurement primitives"
        description="Direct React wrappers around prepare and layout, with width observation separate from text preparation."
        status="Stable"
      />

      <section className="showcase-grid">
        <aside className="panel controls-panel">
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
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Prepare</span><strong>{prepareMs?.toFixed(3) ?? 'off'}</strong></div>
            <div className="metric-box"><span>Lines</span><strong>{layout.lineCount}</strong></div>
            <div className="metric-box"><span>Height</span><strong>{layout.height}px</strong></div>
          </div>

          <div className="preview-lane" style={{ width: `${width}px` }}>
            <PText
              as="p"
              typography={typography}
              className="preview-copy"
            >
              {text}
            </PText>
          </div>
        </section>
      </section>
    </main>
  )
}

export { MeasurePage }
