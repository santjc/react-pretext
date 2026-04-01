import type { ReactNode } from "react";

type ShowcaseIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  statusTone?: "default" | "muted";
  meta?: ReactNode;
};

function ShowcaseIntro({
  eyebrow,
  title,
  description,
  status,
  statusTone = "default",
  meta,
}: ShowcaseIntroProps) {
  return (
    <section className="showcase-intro">
      <div className="showcase-intro-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="page-title">{title}</h2>
        <p className="page-copy">{description}</p>
        {(status || meta) && (
          <div className="showcase-intro-meta">
            {status ? <span className={statusTone === 'muted' ? 'status-tag status-tag-muted' : 'status-tag'}>{status}</span> : null}
            {meta}
          </div>
        )}
      </div>
    </section>
  );
}

export { ShowcaseIntro };
