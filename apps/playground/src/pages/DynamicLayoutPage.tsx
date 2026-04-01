import { useMemo, useState } from 'react'
import { PText, createPretextTypography, usePreparedSegments } from '@santjc/react-pretext'
import { createLineSlotResolver, getCircleBlockedLineRangeForRow, useTextFlow } from '@santjc/react-pretext/editorial'
import { ShowcaseIntro } from '../components/ShowcaseIntro'

const dynamicTitle = 'Dynamic layouts can reroute headlines and body copy around fixed obstacles without asking the browser for text measurements.'

const dynamicBody = `The point of the spread is not merely that text wraps. The point is that every line is routed from explicit geometry. Resize the stage and the route changes immediately while the prepared text remains reusable.

This is useful when a layout behaves more like a composition engine than a block stack. Logos, badges, illustrations, or product callouts can all reserve space in the middle of the article without forcing the rest of the page back through DOM reads.

The layout stays legible because Pretext still owns the line breaking. JavaScript owns the geometry. That split is what makes the demo feel deterministic instead of improvised.`

function DynamicLayoutPage() {
  const [width, setWidth] = useState(900)
  const [height, setHeight] = useState(520)
  const [lineHeight, setLineHeight] = useState(26)
  const titleFont = '700 34px GeistVariable, sans-serif'
  const bodyFont = '400 16px GeistVariable, sans-serif'
  const captionTypography = createPretextTypography({
    font: '500 13px GeistVariable, sans-serif',
    lineHeight: 18,
    width: 220,
  })

  const titlePrepared = usePreparedSegments({ text: dynamicTitle, font: titleFont })
  const bodyPrepared = usePreparedSegments({ text: dynamicBody, font: bodyFont, options: { whiteSpace: 'pre-wrap' } })

  const obstacleA = useMemo(
    () => ({ x: Math.round(width * 0.11), y: 38, radius: 58 }),
    [width],
  )
  const obstacleB = useMemo(
    () => ({ x: Math.round(width * 0.76), y: 66, radius: 82 }),
    [width],
  )
  const obstacleC = useMemo(
    () => ({ x: Math.round(width * 0.66), y: 268, radius: 72 }),
    [width],
  )

  const titleSlotResolver = useMemo(
    () =>
      createLineSlotResolver({
        baseLineSlot: { left: 28, right: width - 28 },
        lineHeight: 42,
        minWidth: 240,
        getBlockedLineRanges: (lineTop, lineBottom) =>
          [obstacleA, obstacleB].flatMap((orb) => {
            const blocked = getCircleBlockedLineRangeForRow({
              cx: orb.x,
              cy: orb.y,
              radius: orb.radius,
              lineTop,
              lineBottom,
              horizontalPadding: 18,
            })

            return blocked === null ? [] : [blocked]
          }),
      }),
    [obstacleA, obstacleB, width],
  )

  const bodySlotResolver = useMemo(
    () =>
      createLineSlotResolver({
        baseLineSlot: { left: 28, right: width - 28 },
        lineHeight,
        minWidth: 180,
        getBlockedLineRanges: (lineTop, lineBottom) =>
          [obstacleC].flatMap((orb) => {
            const blocked = getCircleBlockedLineRangeForRow({
              cx: orb.x,
              cy: orb.y,
              radius: orb.radius,
              lineTop,
              lineBottom,
              horizontalPadding: 16,
            })

            return blocked === null ? [] : [blocked]
          }),
      }),
    [lineHeight, obstacleC, width],
  )

  const titleFlow = useTextFlow({
    prepared: titlePrepared.prepared,
    lineHeight: 42,
    getLineSlotAtY: titleSlotResolver,
    maxY: 196,
  })

  const bodyFlow = useTextFlow({
    prepared: bodyPrepared.prepared,
    lineHeight,
    getLineSlotAtY: bodySlotResolver,
    startY: 218,
    maxY: height - 24,
  })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Dynamic Layout"
        title="Fixed-height spread with routed text"
        description="Headline and body copy both route around explicit geometry inside a bounded editorial stage. Resize it and the line path changes immediately."
        status="Advanced subpath"
      />

      <section className="showcase-grid">
        <aside className="panel controls-panel">
          <label className="field">
            <span>Stage width: {width}px</span>
            <input type="range" min="620" max="1080" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Stage height: {height}px</span>
            <input type="range" min="420" max="680" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Body leading: {lineHeight}px</span>
            <input type="range" min="22" max="34" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
          </label>
          <div className="note-card">
            <p className="eyebrow eyebrow-muted">Why it matters</p>
            <p className="page-copy">This is the step beyond block measurement: one prepared paragraph can be manually routed through arbitrary page geometry.</p>
          </div>
        </aside>

        <section className="panel display-panel">
          <div className="metrics-inline">
            <div className="metric-box"><span>Headline lines</span><strong>{titleFlow.lines.length}</strong></div>
            <div className="metric-box"><span>Body lines</span><strong>{bodyFlow.lines.length}</strong></div>
            <div className="metric-box"><span>Body exhausted</span><strong>{bodyFlow.exhausted ? 'yes' : 'no'}</strong></div>
          </div>

          <div className="dynamic-layout-stage" style={{ width: `${width}px`, height: `${height}px` }}>
            <div className="dynamic-orb dynamic-orb-brand" style={{ left: `${obstacleA.x - obstacleA.radius}px`, top: `${obstacleA.y - obstacleA.radius}px`, width: `${obstacleA.radius * 2}px`, height: `${obstacleA.radius * 2}px` }} />
            <div className="dynamic-orb dynamic-orb-outline" style={{ left: `${obstacleB.x - obstacleB.radius}px`, top: `${obstacleB.y - obstacleB.radius}px`, width: `${obstacleB.radius * 2}px`, height: `${obstacleB.radius * 2}px` }} />
            <div className="dynamic-orb dynamic-orb-soft" style={{ left: `${obstacleC.x - obstacleC.radius}px`, top: `${obstacleC.y - obstacleC.radius}px`, width: `${obstacleC.radius * 2}px`, height: `${obstacleC.radius * 2}px` }} />

            {titleFlow.lines.map((line, index) => (
              <div key={`title-${index}`} className="dynamic-title-line" style={{ left: `${line.slotLeft}px`, top: `${line.y}px`, width: `${Math.ceil(line.slotWidth)}px`, font: titleFont, lineHeight: '42px' }}>
                {line.text}
              </div>
            ))}

            {bodyFlow.lines.map((line, index) => (
              <div key={`body-${index}`} className="dynamic-body-line" style={{ left: `${line.slotLeft}px`, top: `${line.y}px`, width: `${Math.ceil(line.slotWidth)}px`, font: bodyFont, lineHeight: `${lineHeight}px`, whiteSpace: 'pre' }}>
                {line.text}
              </div>
            ))}

            <div className="dynamic-layout-caption">
              <PText
                as="p"
                typography={captionTypography}
              >
                Obstacles reserve geometry first. Text routing happens second.
              </PText>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export { DynamicLayoutPage }
