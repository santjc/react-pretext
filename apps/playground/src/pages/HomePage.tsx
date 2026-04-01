import { Link } from "react-router-dom";
import { ShowcaseIntro } from "../components/ShowcaseIntro";

const showcases = [
  {
    to: "/showcase/accordion",
    title: "Accordion",
    body: "Open-panel heights predicted from Pretext instead of hidden measuring nodes and scrollHeight reads.",
    status: "Stable",
  },
  {
    to: "/showcase/bubbles",
    title: "Bubbles",
    body: "Multiline bubble shrinkwrap that finds the narrowest width preserving the same wrapped line count.",
    status: "Stable",
  },
  {
    to: "/showcase/dynamic-layout",
    title: "Dynamic Layout",
    body: "A fixed-height spread with line routing around explicit obstacles and zero DOM reads in the hot path.",
    status: "Stable",
  },
  {
    to: "/showcase/editorial-engine",
    title: "Editorial Engine",
    body: "Animated geometry, pull quotes, and multi-column continuation built directly from the package primitives.",
    status: "Stable",
  },
  {
    to: "/showcase/editorial",
    title: "Editorial",
    body: "The original newspaper composition showcase with balanced column relationships and obstacle-aware text flow.",
    status: "Stable",
  },
  {
    to: "/showcase/masonry",
    title: "Masonry",
    body: "Text-card packing driven by predicted heights so feeds can place cards before they hit the DOM.",
    status: "Stable",
  },
] as const;

function HomePage() {
  return (
    <main className="page overview-page">
      <section className="hero-panel panel">
        <ShowcaseIntro
          eyebrow="Design goal"
          title="Replicate the strongest Pretext demos with a thin React layer."
          description="This playground now focuses on the product-shaped showcases that best explain why the package exists: predictable heights, tighter multiline UI, manual line routing, and layout algorithms built from the same primitives."
          meta={
            <div className="hero-meta">
              <div className="meta-chip">
                <span>Package</span>
                <strong>1.0.0</strong>
              </div>
              <div className="meta-chip">
                <span>Showcases</span>
                <strong>5 live demos</strong>
              </div>
              <div className="meta-chip">
                <span>Focus</span>
                <strong>utility over hype</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="card-grid">
        {showcases.map((showcase, index) => (
          <Link
            key={showcase.to}
            to={showcase.to}
            className="panel showcase-card"
          >
            <div className="card-head">
              <p className="card-index">0{index + 1}</p>
              <span className="status-tag">{showcase.status}</span>
            </div>
            <h3>{showcase.title}</h3>
            <p>{showcase.body}</p>
            <span className="card-cta">Open showcase</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

export { HomePage };
