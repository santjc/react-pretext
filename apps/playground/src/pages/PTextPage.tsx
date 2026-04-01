import { PText } from '@santjc/react-pretext'
import { ShowcaseIntro } from '../components/ShowcaseIntro'
import { PLAYGROUND_FONT_FAMILY, buildPlaygroundTextStyle } from '../lib/typography'

function PTextPage() {
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
              width={720}
              font={`600 40px ${PLAYGROUND_FONT_FAMILY}`}
              lineHeight={42}
              style={{ width: 'min(100%, 720px)', ...buildPlaygroundTextStyle(40, 42, 600) }}
            >
              Headlines preserve semantics
            </PText>
          </div>

          <div className="semantic-row">
            <p className="semantic-tag">{'<p>'}</p>
            <PText
              as="p"
              width={760}
              font={`400 18px ${PLAYGROUND_FONT_FAMILY}`}
              lineHeight={30}
              style={{ width: 'min(100%, 760px)', ...buildPlaygroundTextStyle(18, 30) }}
            >
              Body text flows naturally while pretext handles measurement behind the scenes. The DOM stays simple and the
              tag remains the real semantic element.
            </PText>
          </div>

          <div className="semantic-row">
            <p className="semantic-tag">{'<h2>'}</p>
            <PText
              as="h2"
              width={620}
              font={`600 28px ${PLAYGROUND_FONT_FAMILY}`}
              lineHeight={30}
              style={{ width: 'min(100%, 620px)', ...buildPlaygroundTextStyle(28, 30, 600) }}
            >
              Subheadings work too
            </PText>
          </div>
        </div>
      </section>

      <section className="panel code-panel">
        <p className="eyebrow eyebrow-muted">Usage</p>
        <pre className="code-block">{`<PText as="h1" font={headingFont}>
  Headlines preserve semantics
</PText>

<PText as="p" font={bodyFont}>
  Body text flows naturally...
</PText>`}</pre>
      </section>
    </main>
  )
}

export { PTextPage }
