import { useEffect, useMemo, useState } from 'react'
import { createPretextTypography } from '@santjc/react-pretext'
import { EditorialColumns } from '@santjc/react-pretext/editorial'
import { ShowcaseIntro } from '../components/ShowcaseIntro'

const engineText = `The editorial engine demo is where the package starts to feel less like a measurement helper and more like a composition tool. Each track owns explicit width, padding, and obstruction rules, but the text cursor continues across the whole spread.

Animated figures can drift through the page while the lines reflow around them. Pull quotes can be treated as solid geometry instead of magical floating boxes. A design system can still own the look and tone of the spread, while Pretext remains responsible for the actual line breaking.

That combination is the value proposition for layouts that are too opinionated for normal blocks and too dynamic for browser justification alone. The geometry is explicit. The relayout is cheap. The DOM does not need to answer the question of where the next line should go.`

function EditorialEnginePage() {
  const [isRunning, setIsRunning] = useState(true)
  const [phase, setPhase] = useState(0)
  const [gap, setGap] = useState(22)
  const [lineHeight, setLineHeight] = useState(24)
  const font = '400 15px GeistVariable, sans-serif'
  const titleTypography = createPretextTypography({
    font: '700 40px GeistVariable, sans-serif',
    lineHeight: 42,
    width: 920,
  })

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const frame = window.setInterval(() => {
      setPhase((current) => current + 1)
    }, 80)

    return () => window.clearInterval(frame)
  }, [isRunning])

  const orbA = useMemo(
    () => ({ x: 24 + ((Math.sin(phase / 12) + 1) / 2) * 80, y: 36 + ((Math.cos(phase / 10) + 1) / 2) * 180 }),
    [phase],
  )
  const orbB = useMemo(
    () => ({ x: 22 + ((Math.cos(phase / 13) + 1) / 2) * 84, y: 150 + ((Math.sin(phase / 9) + 1) / 2) * 156 }),
    [phase],
  )

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Editorial Engine"
        title="Animated geometry with multi-column continuation"
        description="Moving orbs, fixed pull quotes, and a shared text cursor across multiple tracks. The line layout updates from explicit geometry instead of DOM reads."
        status="Advanced subpath"
      />

      <section className="controls-inline-panel controls-inline-panel-wide panel">
        <label className="field">
          <span>Track gap: {gap}px</span>
          <input type="range" min="14" max="30" value={gap} onChange={(event) => setGap(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>Body leading: {lineHeight}px</span>
          <input type="range" min="20" max="32" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
        </label>
        <div className="field field-buttons">
          <span>Animation</span>
          <div className="segmented-control" role="group" aria-label="Animation">
            <button type="button" className={isRunning ? 'segmented-control-button active' : 'segmented-control-button'} onClick={() => setIsRunning(true)}>
              Live
            </button>
            <button type="button" className={!isRunning ? 'segmented-control-button active' : 'segmented-control-button'} onClick={() => setIsRunning(false)}>
              Pause
            </button>
          </div>
        </div>
        <div className="note-card">
          <p className="eyebrow eyebrow-muted">Why it matters</p>
          <p className="page-copy">The text cursor hands off from one track to the next, so the whole spread behaves like one continuous article with moving obstacles.</p>
          <p className="page-copy editorial-engine-aside">
            <strong className="engine-sidecard-kicker">Zero DOM reads</strong>
            {' '}
            Line placement does not use layout measurement on the DOM; every obstacle is explicit geometry.
          </p>
        </div>
      </section>

      <section className="panel editorial-engine-panel">
        <div className="editorial-engine-header">
          <p className="eyebrow">Mockup 151</p>
          <h2 className="editorial-engine-title" style={{ ...titleTypography.style, width: 'min(100%, 920px)' }}>
            Live text reflow around animated obstacles
          </h2>
        </div>

        <EditorialColumns
          text={engineText}
          font={font}
          lineHeight={lineHeight}
          gap={gap}
          lineRenderMode="justify"
          prepareOptions={{ whiteSpace: 'pre-wrap' }}
          className="editorial-engine-columns"
          tracks={[
            {
              fr: 1.15,
              minHeight: 420,
              paddingInline: 14,
              className: 'editorial-engine-track',
              figures: [
                { shape: 'circle', width: 112, height: 112, x: orbA.x, y: orbA.y, linePadding: 16, content: <div className="engine-orb engine-orb-primary" /> },
                {
                  shape: 'rect',
                  width: 146,
                  height: 124,
                  placement: 'bottom-left',
                  linePadding: 12,
                  content: (
                    <div className="engine-pullquote">
                      <p>"Geometry first, line breaking second."</p>
                    </div>
                  ),
                },
              ],
            },
            {
              fr: 0.92,
              minHeight: 420,
              paddingInline: 14,
              className: 'editorial-engine-track',
              figures: [{ shape: 'circle', width: 124, height: 124, x: orbB.x, y: orbB.y, linePadding: 16, content: <div className="engine-orb engine-orb-outline" /> }],
            },
            { fr: 0.93, minHeight: 420, paddingInline: 14, className: 'editorial-engine-track' },
          ]}
        />
      </section>
    </main>
  )
}

export { EditorialEnginePage }
