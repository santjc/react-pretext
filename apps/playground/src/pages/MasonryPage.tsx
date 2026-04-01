import { useMemo, useState } from 'react'
import { PText, createPretextTypography } from '@santjc/react-pretext'
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

function MasonryPage() {
  const [containerWidth, setContainerWidth] = useState(980)
  const [columnCount, setColumnCount] = useState(3)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(26)
  const gap = 18
  const cardChromeHeight = 112
  const columnWidth = Math.floor((containerWidth - gap * (columnCount - 1)) / columnCount)
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

  const packed = useMemo(() => packMasonryCards(predictedCards, columnCount, gap), [columnCount, gap, predictedCards])

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="Masonry"
        title="Text-card packing without DOM reads"
        description="Card heights are predicted from Pretext before placement, so the feed can pack itself without rendering every card just to learn its size."
        status="Stable primitives"
      />

      <section className="controls-inline-panel controls-inline-panel-wide panel">
        <label className="field">
          <span>Container width: {containerWidth}px</span>
          <input type="range" min="640" max="1160" value={containerWidth} onChange={(event) => setContainerWidth(Number(event.target.value))} />
        </label>
        <label className="field">
          <span>Columns: {columnCount}</span>
          <input type="range" min="2" max="4" step="1" value={columnCount} onChange={(event) => setColumnCount(Number(event.target.value))} />
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

        <div className="masonry-stage" style={{ width: `${containerWidth}px`, gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
          {packed.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="masonry-column" style={{ gap: `${gap}px` }}>
              {column.map((item) => (
                <article key={item.card.id} className={`masonry-card masonry-card-${item.card.accent}`}>
                  <div className="masonry-card-head">
                    <span className="status-tag status-tag-muted">{item.lineCount} lines</span>
                    <span className="masonry-height-label">{item.totalHeight}px</span>
                  </div>
                  <h3 className="masonry-card-title">{item.card.title}</h3>
                  <PText
                    as="p"
                    typography={typography}
                    className="masonry-card-copy"
                  >
                    {item.card.body}
                  </PText>
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
