import { useMemo, useState } from 'react'
import { createPretextTypography } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { getBubbleMetrics } from '../lib/shrinkwrap'
import { buildPlaygroundFont } from '../lib/typography'

const bubblePresets = [
  'Yo did you see the new Pretext library? It measures text without the DOM. Pure JavaScript arithmetic.',
  'That shrinkwrap demo is wild. It finds the exact minimum width for multiline text. CSS still leaves dead bubble area behind the last line.',
  'كل شيء يعمل هنا ايضا. Mixed bidi, grapheme clusters, emoji, and variable fonts still need the same wrapping guarantees.',
] as const

const BUBBLE_HORIZONTAL_CHROME = 36

function getBubbleStyle(typography: ReturnType<typeof createPretextTypography>) {
  return {
    ...typography.style,
    width: `${(typography.width ?? 0) + BUBBLE_HORIZONTAL_CHROME}px`,
  }
}

function BubblesPage() {
  const [text, setText] = useState<string>(bubblePresets[1])
  const [containerWidth, setContainerWidth] = useState(340)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(28)
  const font = buildPlaygroundFont(400, fontSize)

  const metrics = useMemo(
    () => getBubbleMetrics({ text, font, maxWidth: containerWidth, lineHeight }),
    [containerWidth, font, lineHeight, text],
  )
  const cssTypography = createPretextTypography({ font, lineHeight, width: metrics.cssWidth })
  const shrinkwrapTypography = createPretextTypography({ font, lineHeight, width: metrics.shrinkwrapWidth })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Bubbles"
        title="Tight multiline message bubbles"
        description="CSS `fit-content` sizes to the widest wrapped line. Pretext can binary-search the narrowest width that preserves the exact same line count."
        status="Stable + utility"
      />

      <section className="showcase-grid">
        <aside className="panel controls-panel">
          <label className="field">
            <span>Message</span>
            <textarea value={text} rows={8} onChange={(event) => setText(event.target.value)} />
          </label>
          <label className="field">
            <span>Container width: {containerWidth}px</span>
            <input type="range" min="220" max="520" value={containerWidth} onChange={(event) => setContainerWidth(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Body size: {fontSize}px</span>
            <input type="range" min="14" max="24" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Body leading: {lineHeight}px</span>
            <input type="range" min="22" max="36" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
          </label>
          <div className="preset-row">
            {bubblePresets.map((preset) => (
              <button key={preset} type="button" className={preset === text ? 'mini-chip active' : 'mini-chip'} onClick={() => setText(preset)}>
                Sample
              </button>
            ))}
          </div>
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Lines</span><strong>{metrics.lineCount}</strong></div>
            <div className="metric-box"><span>CSS width</span><strong>{metrics.cssWidth}px</strong></div>
            <div className="metric-box"><span>Pretext width</span><strong>{metrics.shrinkwrapWidth}px</strong></div>
            <div className="metric-box"><span>Saved</span><strong>{metrics.cssWidth - metrics.shrinkwrapWidth}px</strong></div>
          </div>

          <div className="compare-grid compare-grid-stacked">
            <article className="panel compare-column compare-column-soft">
              <div className="example-head">
                <div>
                  <p className="eyebrow eyebrow-muted">CSS fit-content</p>
                  <h3 className="example-title">Widest wrapped line wins</h3>
                </div>
                <div className="compare-meta">
                  <span className="status-tag status-tag-muted">waste {metrics.cssWaste}px</span>
                </div>
              </div>
              <div className="core-bubble-wrap" style={{ maxWidth: `${containerWidth}px` }}>
                <p className="bubble bubble-css" style={getBubbleStyle(cssTypography)}>
                  {text}
                </p>
              </div>
            </article>

            <article className="panel compare-column compare-column-accent">
              <div className="example-head">
                <div>
                  <p className="eyebrow">Pretext shrinkwrap</p>
                  <h3 className="example-title">Same line count, less wasted area</h3>
                </div>
                <div className="compare-meta">
                  <span className="status-tag">waste {metrics.shrinkwrapWaste}px</span>
                </div>
              </div>
              <div className="core-bubble-wrap" style={{ maxWidth: `${containerWidth}px` }}>
                <p className="bubble bubble-accent" style={getBubbleStyle(shrinkwrapTypography)}>
                  {text}
                </p>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  )
}

export { BubblesPage }
