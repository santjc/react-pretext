import { Link } from 'react-router-dom'
import { ShowcaseIntro } from '../components/ShowcaseIntro'

const coreShowcases = [
  {
    to: '/showcase/core',
    title: 'Core path',
    body: 'Move through the essential package story in one place: measure text, use responsive semantic rendering when it helps, replace scrollHeight wiring, and truncate previews within a known line budget.',
    status: 'Start here',
  },
  {
    to: '/showcase/accordion',
    title: 'Replace scrollHeight wiring',
    body: 'Predict accordion panel height before opening, without a hidden probe node or layout reads tied to scrollHeight.',
    status: 'Migration',
  },
  {
    to: '/showcase/masonry',
    title: 'Measured cards and lists',
    body: 'Predict card heights from responsive column width and typography so feeds can place items before they hit the DOM.',
    status: 'Core',
  },
] as const

const utilityShowcases = [
  {
    to: '/showcase/bubbles',
    title: 'Bubble shrinkwrap',
    body: 'A utility-style example that preserves line count while finding a tighter multiline width than CSS fit-content.',
    status: 'Utility',
  },
] as const

const advancedShowcases = [
  {
    to: '/showcase/dynamic-layout',
    title: 'Dynamic Layout',
    body: 'Advanced line routing around explicit geometry inside a bounded stage. Useful once block measurement is no longer enough.',
    status: 'Advanced',
  },
  {
    to: '/showcase/editorial-engine',
    title: 'Editorial Engine',
    body: 'Animated geometry, pull quotes, and multi-column continuation built directly from the advanced editorial layer.',
    status: 'Advanced',
  },
  {
    to: '/showcase/editorial',
    title: 'Editorial',
    body: 'The newspaper composition showcase remains available as an advanced example rather than the default package story.',
    status: 'Advanced',
  },
] as const

function ShowcaseSection({
  eyebrow,
  title,
  description,
  showcases,
}: {
  eyebrow: string
  title: string
  description: string
  showcases: ReadonlyArray<{ to: string; title: string; body: string; status: string }>
}) {
  return (
    <section className="panel semantic-panel">
      <div>
        <p className="eyebrow eyebrow-muted">{eyebrow}</p>
        <h2 className="example-title">{title}</h2>
        <p className="page-copy">{description}</p>
      </div>

      <div className="card-grid">
        {showcases.map((showcase, index) => (
          <Link key={showcase.to} to={showcase.to} className="panel showcase-card">
            <div className="card-head">
              <p className="card-index">0{index + 1}</p>
              <span className={showcase.status === 'Advanced' ? 'status-tag status-tag-muted' : 'status-tag'}>{showcase.status}</span>
            </div>
            <h3>{showcase.title}</h3>
            <p>{showcase.body}</p>
            <span className="card-cta">Open showcase</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <main className="page overview-page">
      <section className="hero-panel panel">
        <ShowcaseIntro
          eyebrow="Start here"
          title="Adopt Pretext from normal React component patterns first."
          description="The main path now lives in one Core route: define typography once, measure text with one hook, use responsive semantic rendering only where it helps, replace scrollHeight wiring, and truncate previews before render. Editorial showcases stay available once you need custom flow."
          meta={
            <div className="hero-meta">
              <div className="meta-chip">
                <span>Package</span>
                <strong>1.0.0</strong>
              </div>
              <div className="meta-chip">
                <span>Core path</span>
                <strong>measure / responsive / truncate</strong>
              </div>
              <div className="meta-chip">
                <span>Focus</span>
                <strong>normal adoption first</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="panel display-panel adoption-path-section">
        <p className="eyebrow eyebrow-muted">Recommended adoption path</p>
        <div className="adoption-path-grid">
          <div className="adoption-step adoption-step-active">
            <p className="semantic-tag">01</p>
            <p className="page-copy">Create one shared typography config so the same values drive measurement and DOM output.</p>
          </div>
          <div className="adoption-step">
            <p className="semantic-tag">02</p>
            <p className="page-copy">Use <code>useMeasuredText()</code> for the simplest measured-height or line-count cases, then apply the result to ordinary component layout.</p>
          </div>
          <div className="adoption-step">
            <p className="semantic-tag">03</p>
            <p className="page-copy">Render with real semantic tags while reusing the same typography values for visual alignment.</p>
          </div>
          <div className="adoption-step">
            <p className="semantic-tag">04</p>
            <p className="page-copy">Use the predicted height or truncated preview text in ordinary UI like accordions, card feeds, list rows, or previews before reaching for advanced editorial flow.</p>
          </div>
        </div>
      </section>

      <ShowcaseSection
        eyebrow="Core demos"
        title="Understand the package from common app usage"
        description="These are the routes a new consumer should open first. They show the smallest happy path before any custom line routing or editorial composition enters the picture."
        showcases={coreShowcases}
      />

      <ShowcaseSection
        eyebrow="Utility demos"
        title="Specialized but still non-editorial"
        description="These examples are still core-friendly, but they are not the first thing most users need to learn."
        showcases={utilityShowcases}
      />

      <ShowcaseSection
        eyebrow="Advanced demos"
        title="Editorial and manual flow come later"
        description="Open these once block measurement and semantic rendering are already familiar. They use the same foundations, but they are intentionally not the default adoption path."
        showcases={advancedShowcases}
      />
    </main>
  )
}

export { HomePage }
