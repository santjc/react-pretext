import { useMemo, useState } from 'react'
import { createPretextTypography } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { packMasonryCards, predictCardLayout, type MasonryCard } from '../lib/masonry'
import { buildPlaygroundFont } from '../lib/typography'

const masonryCards: MasonryCard[] = [
  {
    id: 'm1',
    title: 'Predict card height before placement',
    body: 'A masonry layout normally has to render cards, read their heights, and then reshuffle the grid. Pretext lets the card text height be known from width and typography before the card is positioned.',
    accent: 'amber',
  },
  {
    id: 'm2',
    title: 'Cheap repacking on resize',
    body: 'When the column width changes, every card can be relaid out from text arithmetic alone. The packing algorithm only needs predicted heights, so the browser does not have to answer layout questions for every card.',
    accent: 'blue',
  },
  {
    id: 'm3',
    title: 'Works for content-heavy feeds',
    body: 'This pattern is valuable anywhere you have many text cards: notes, search results, CMS previews, issue lists, or mixed media cards with text as the dominant variable.',
    accent: 'orange',
  },
  {
    id: 'm4',
    title: 'Line count stays visible',
    body: 'Because measurement is explicit, the UI can expose predicted line counts and card heights directly. That makes the layout easier to reason about when tuning the feed.',
    accent: 'amber',
  },
  {
    id: 'm5',
    title: 'One package, two layers',
    body: 'The same package can serve both semantic text components and non-DOM layout algorithms. Masonry is a good example because it uses the measurements without needing a bespoke text component at all.',
    accent: 'blue',
  },
  {
    id: 'm6',
    title: 'Deterministic enough for virtualized UIs',
    body: 'A feed can estimate vertical occupancy well enough to decide placement before items ever hit the screen, which becomes more important as the number of cards climbs.',
    accent: 'orange',
  },
] as const

const MIN_COL_PX = 200

function MasonryPage() {
  const [containerWidth, setContainerWidth] = useState(720)
  const [columnCount, setColumnCount] = useState(2)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(26)
  const gap = 18
  const cardChromeHeight = 112

  const maxColumnsForContainer = useMemo(
    () => Math.max(1, Math.min(4, Math.floor((containerWidth + gap) / (MIN_COL_PX + gap)))),
    [containerWidth, gap],
  )

  const effectiveColumnCount = Math.min(columnCount, maxColumnsForContainer)
  const columnWidth = Math.floor((containerWidth - gap * (effectiveColumnCount - 1)) / effectiveColumnCount)
  const textWidth = Math.max(0, columnWidth - 36)
  const typography = createPretextTypography({
    font: buildPlaygroundFont(400, fontSize),
    lineHeight,
    width: textWidth,
  })

  const predictedCards = useMemo(
    () =>
      masonryCards.map((card) =>
        predictCardLayout({
          card,
          width: textWidth,
          font: typography.font,
          lineHeight: typography.lineHeight,
          chromeHeight: cardChromeHeight,
        }),
      ),
    [cardChromeHeight, textWidth, typography.font, typography.lineHeight],
  )

  const packed = useMemo(() => packMasonryCards(predictedCards, effectiveColumnCount, gap), [effectiveColumnCount, gap, predictedCards])

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Cards and lists"
        title="Measured cards from responsive width"
        description="This is the card-feed version of the same adoption story: observe or compute the available column width, predict text height from shared typography, and place cards before the browser has to answer size questions for every item."
        status="Stable primitives"
      />

      <section className="controls-inline-panel controls-inline-panel-wide panel">
        <label className="field">
          <span>Container width: {containerWidth}px</span>
          <input type="range" min="380" max="1000" value={containerWidth} onChange={(event) => setContainerWidth(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>
            Columns: {effectiveColumnCount}
            {maxColumnsForContainer < 4 ? ` (max ${maxColumnsForContainer} at this width)` : ''}
          </span>
          <input
            type="range"
            min="1"
            max={maxColumnsForContainer}
            step="1"
            value={effectiveColumnCount}
            onChange={(event) => {
              const next = Number(event.target.value)
              setColumnCount(Math.min(next, maxColumnsForContainer))
            }}
          />
        </label>
        <label className="field">
          <span>Body size: {fontSize}px</span>
          <input type="range" min="14" max="20" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>Body leading: {lineHeight}px</span>
          <input type="range" min="22" max="32" value={lineHeight} onChange={(event) => setLineHeight(Number(event.target.value))} />
        </label>
      </section>

      <section className="panel display-panel">
        <div className="metrics-inline">
          <div className="metric-box"><span>Cards</span><strong>{predictedCards.length}</strong></div>
          <div className="metric-box"><span>Column width</span><strong>{columnWidth}px</strong></div>
          <div className="metric-box"><span>Tallest column</span><strong>{Math.max(...packed.columnHeights.map((height) => Math.max(0, height - gap)))}px</strong></div>
        </div>

        <div
          className="masonry-stage masonry-stage-capped"
          style={{
            width: '100%',
            maxWidth: `${containerWidth}px`,
            gridTemplateColumns: `repeat(${effectiveColumnCount}, minmax(0, 1fr))`,
          }}
        >
          {packed.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="masonry-column" style={{ gap: `${gap}px` }}>
              {column.map((item) => (
                <article key={item.card.id} className={`masonry-card masonry-card-${item.card.accent}`}>
                  <div className="masonry-card-head">
                    <span className="status-tag status-tag-muted">{item.lineCount} lines</span>
                    <span className="masonry-height-label">{item.totalHeight}px</span>
                  </div>
                  <h3 className="masonry-card-title">{item.card.title}</h3>
                  <p className="masonry-card-copy" style={typography.style}>
                    {item.card.body}
                  </p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export { MasonryPage }
