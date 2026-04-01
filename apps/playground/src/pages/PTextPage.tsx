import { PText, createPretextTypography } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { buildPlaygroundFont } from '../lib/typography'

function PTextPage() {
  const headlineTypography = createPretextTypography({
    font: buildPlaygroundFont(600, 40),
    lineHeight: 42,
    width: 720,
  })
  const bodyTypography = createPretextTypography({
    font: buildPlaygroundFont(400, 18),
    lineHeight: 30,
    width: 760,
  })
  const subheadingTypography = createPretextTypography({
    font: buildPlaygroundFont(600, 28),
    lineHeight: 30,
    width: 620,
  })

  return (
    <main className="page showcase-page">
      <ShowcaseIntro
        eyebrow="PText"
        title="PText semantic wrapper"
        description="A small DOM component that keeps real tags like h1 and p while delegating text measurement to pretext."
        status="Stable"
      />

      <section className="panel semantic-panel">
        <p className="eyebrow eyebrow-muted">Semantic output</p>
        <div className="semantic-stack">
          <div className="semantic-row semantic-row-active">
            <p className="semantic-tag">{'<h1>'}</p>
            <PText
              as="h1"
              typography={headlineTypography}
              style={{ width: 'min(100%, 720px)' }}
            >
              Headlines preserve semantics
            </PText>
          </div>

          <div className="semantic-row">
            <p className="semantic-tag">{'<p>'}</p>
            <PText
              as="p"
              typography={bodyTypography}
              style={{ width: 'min(100%, 760px)' }}
            >
              Body text flows naturally while pretext handles measurement behind the scenes. The DOM stays simple and the
              tag remains the real semantic element.
            </PText>
          </div>

          <div className="semantic-row">
            <p className="semantic-tag">{'<h2>'}</p>
            <PText
              as="h2"
              typography={subheadingTypography}
              style={{ width: 'min(100%, 620px)' }}
            >
              Subheadings work too
            </PText>
          </div>
        </div>
      </section>

      <section className="panel code-panel">
        <p className="eyebrow eyebrow-muted">Usage</p>
        <pre className="code-block">{`const heading = createPretextTypography({
  font: '600 40px GeistVariable, sans-serif',
  lineHeight: 42,
  width: 720,
})

<PText as="h1" typography={heading}>
  Headlines preserve semantics
</PText>

<PText as="p" typography={body}>
  Body text flows naturally...
</PText>`}</pre>
      </section>
    </main>
  )
}

export { PTextPage }
