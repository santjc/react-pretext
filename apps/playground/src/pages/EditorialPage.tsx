import { useState } from "react";
import { PText } from "@santjc/react-pretext";
import {
  EditorialColumns,
  EditorialSurface,
} from "@santjc/react-pretext/editorial";
import { ShowcaseIntro } from "../components/ShowcaseIntro";
import { fontWeightOptions } from "../lib/typography";

const NEWSPRINT_FONT_FAMILY = "GeistVariable, sans-serif";

const leftRailText = `Witnesses in Croydon, Le Bourget, and Cologne now speak of the aeroplane the way they once spoke of the locomotive: not merely as a machine, but as a timetable that will soon govern commerce, distance, and expectation. Hotel porters have learned the names of pilots. Port authorities now track air schedules beside steamship arrivals.

Dispatches from field correspondents describe crowds assembling before dawn whenever a notable flight is rumored. Children point first to the propeller, then to the pilot's goggles. Mechanics, meanwhile, speak in the language of oil, weather, and patience, reminding enthusiasts that spectacle depends on maintenance.

The marvel is therefore double. One sees the machine in the sky, and beneath it the new class of routines required to keep it there.`;

const featureText = `Across Europe and the Atlantic corridor, the promise of air travel is no longer presented as a stunt reserved for expositions and daredevils. Municipal officials are discussing aerodromes in the tone once reserved for rail depots, while insurers, publishers, and exporters have all begun to calculate what a shorter map might mean for ordinary business.

Pilots interviewed this week describe the work less as conquest than as discipline. They watch the color of weather fronts, the steadiness of fuel feed, the tremor in the frame, and the peculiar geometry of fields suitable for landing. A successful route is rarely an act of reckless bravado. It is a chain of small judgments, repeated without drama, until the destination appears below the wing.

Manufacturers insist that the next contest will not be altitude alone but reliability. Cabin comfort, steady schedules, spare parts, and trusted maintenance crews may do more to usher in the aerial age than any single headline-making crossing. That argument is finding support among businessmen who care less for records than for predictability.

Editors have noticed the same shift. Readers still admire feats of daring, but they are increasingly drawn to the practical consequence of airborne connection: fresh newspapers carried between capitals, correspondence that arrives before a rumor grows old, and engineers who can inspect machinery on one morning and dine in another country by evening.

If the age of aviation is truly arriving, it will be measured not only by the roar above the crowd but by the calmer evidence below it: contracts written on tighter schedules, provincial towns linked to larger markets, and citizens learning to imagine a continent in hours rather than days.`;

const rightRailText = `Bankers in Paris and brokers in New York alike have begun to ask whether speed itself can be traded. The question sounds fanciful until one reads the ledgers attached to express mail, perishables, and diplomatic dispatch. What was once a curiosity at the edge of modern life is moving toward its center.

Designers of the latest craft insist that utility will proceed in stages. First come lighter structures and more regular service. Then come cabins suited not only for hardy enthusiasts but for clerks, diplomats, and travelers who expect the journey to be civilized. Every improvement in comfort widens the class of people willing to fly.

Aviation therefore advances by romance and arithmetic together. The posters summon the public with heroics, but the balance sheet will decide whether the route remains in operation after the crowd has gone home.`;

const bottomLeftText = `Provincial clubs continue to hold exhibitions in which local mechanics compare engines, wing struts, and fuel lines with the solemnity of surgeons. The gatherings are modest, but they have become schools in miniature for the next generation of airmen.`;

const bottomCenterText = `Cartographers now revise their route diagrams with unusual frequency. Distances once measured by sea-lane and mountain pass are being recalculated by fuel stop and prevailing wind. The globe is not smaller in fact, but it is becoming smaller in habit.`;

const bottomWideText = `The newest mountain surveys suggest that aviation will reshape not only commercial timetables but the very imagination of geography. Ranges long treated as barriers now appear, from the cockpit, as a sequence of weather judgments and elevation marks. The same ridges that delayed caravans and trains for generations may soon be crossed by pilots who read the sky as carefully as sailors once read a harbor.

Engineers caution that terrain remains unforgiving. Thin air alters lift, sudden downdrafts confuse the inexperienced, and a valley that seems inviting from above may offer no safe landing ground at all. Yet these warnings have not discouraged planners who believe alpine and transcontinental routes will eventually bind remote districts more closely to the capitals.

For now, the mountain remains both obstacle and advertisement: a dramatic proof that aviation's next chapter will be written where spectacle meets endurance.`;

function buildNewsprintFont(fontWeight: number, fontSize: number) {
  return `${fontWeight} ${fontSize}px ${NEWSPRINT_FONT_FAMILY}`;
}

function Placeholder({ className }: { className?: string }) {
  return <div className={`np-placeholder ${className ?? ""}`} />;
}

function EditorialPage() {
  const [fontSize, setFontSize] = useState(12);
  const [lineHeight, setLineHeight] = useState(18);
  const [fontWeight, setFontWeight] = useState(400);
  const [gap, setGap] = useState(18);
  const [justifyEnabled, setJustifyEnabled] = useState(true);
  const [whiteSpaceMode, setWhiteSpaceMode] = useState<"normal" | "pre-wrap">("pre-wrap");
  const font = buildNewsprintFont(fontWeight, fontSize);
  const lineRenderMode = justifyEnabled ? "justify" : "natural";
  const prepareOptions = whiteSpaceMode === "pre-wrap" ? { whiteSpace: "pre-wrap" as const } : undefined;
  const mainTrackHeight = 420;
  const sideSurfaceHeight = 452;
  const bottomSurfaceHeight = 216;

  return (
    <main className="page showcase-page">
        <ShowcaseIntro
          eyebrow="Editorial"
          title="Editorial newspaper lab"
          description="A newspaper-structured showcase tuned to the site aesthetic: responsive PText headlines, single-surface wraparound text, multi-track cursor handoff, and pretext-driven justify spacing with proportionally related columns."
          status="Advanced subpath"
        />

      <section className="panel controls-inline-panel controls-inline-panel-wide controls-inline-panel-editorial">
        <label className="field">
          <span>Body size: {fontSize}px</span>
          <input type="range" min="10" max="16" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>Body leading: {lineHeight}px</span>
          <input type="range" min="14" max="24" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>Body weight</span>
          <select value={fontWeight} onChange={(e) => setFontWeight(Number(e.target.value))}>
            {fontWeightOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Track gap: {gap}px</span>
          <input type="range" min="12" max="28" value={gap} onChange={(e) => setGap(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>Whitespace</span>
          <select value={whiteSpaceMode} onChange={(e) => setWhiteSpaceMode(e.target.value as "normal" | "pre-wrap") }>
            <option value="normal">normal</option>
            <option value="pre-wrap">pre-wrap</option>
          </select>
        </label>
        <div className="field field-buttons">
          <span>Justify rendering</span>
          <div className="segmented-control" role="group" aria-label="Justify rendering">
            <button type="button" className={!justifyEnabled ? "segmented-control-button active" : "segmented-control-button"} onClick={() => setJustifyEnabled(false)}>
              Natural
            </button>
            <button type="button" className={justifyEnabled ? "segmented-control-button active" : "segmented-control-button"} onClick={() => setJustifyEnabled(true)}>
              Justify
            </button>
          </div>
        </div>
      </section>

      <section className="newsprint-paper">
        <header className="newsprint-masthead">
          <div className="newsprint-masthead-side">
            <span className="newsprint-label">Vol. 127 &middot; No. 38</span>
            <strong className="newsprint-side-title">Latest News &amp; Pictures</strong>
            <span className="newsprint-label">Est. 1888</span>
          </div>
          <div className="newsprint-masthead-center">
            <span className="newsprint-label">City, Weekday, Month DD, YYYY &middot; XX pages in X sections</span>
            <h2 className="newsprint-title">The World Herald</h2>
            <span className="newsprint-label">Los Angeles &middot; California</span>
          </div>
          <div className="newsprint-masthead-side newsprint-masthead-side-right">
            <span className="newsprint-label">Price</span>
            <strong className="newsprint-price">2c</strong>
            <span className="newsprint-label">Illustrated Weekly</span>
          </div>
        </header>

        <div className="newsprint-rule newsprint-rule-thick" />

        <section className="newsprint-banner-row">
          <PText
            as="h1"
            font={`800 46px ${NEWSPRINT_FONT_FAMILY}`}
            lineHeight={46}
            className="newsprint-banner-title"
            style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "46px", lineHeight: "46px", fontWeight: 800 }}
          >
            Around the World by Aeroplane
          </PText>
          <p className="newsprint-deck">Important title here &middot; Short note may go here</p>
        </section>

        <div className="newsprint-rule" />

        <section className="newsprint-main-grid">
          <aside className="newsprint-rail">
            <PText
              as="h3"
              font={`800 22px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={23}
              className="newsprint-col-headline"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "22px", lineHeight: "23px", fontWeight: 800 }}
            >
              Latest dispatches from the continental flying fields
            </PText>

            <EditorialSurface
              text={leftRailText}
              font={font}
              lineHeight={lineHeight}
              minHeight={sideSurfaceHeight}
              lineRenderMode={lineRenderMode}
              prepareOptions={prepareOptions}
              className="newsprint-body"
              figures={[{ shape: 'rect', width: 120, height: 156, placement: 'top-center', linePadding: 10, content: <Placeholder /> }]}
            />
          </aside>

          <article className="newsprint-feature">
            <Placeholder className="np-placeholder-hero" />

            <PText
              as="h2"
              font={`800 34px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={34}
              className="newsprint-feature-headline"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "34px", lineHeight: "34px", fontWeight: 800 }}
            >
              Consectetur Adipisicing
            </PText>

            <EditorialColumns
              text={featureText}
              font={font}
              lineHeight={lineHeight}
              gap={gap}
              lineRenderMode={lineRenderMode}
              prepareOptions={prepareOptions}
              className="newsprint-columns"
              tracks={[
                {
                  fr: 1,
                  minHeight: mainTrackHeight,
                  paddingInline: 10,
                  className: 'newsprint-track',
                  figures: [{ shape: 'rect', width: 178, height: 110, placement: 'top-right', linePadding: 10, content: <Placeholder /> }],
                },
                {
                  fr: 1,
                  minHeight: mainTrackHeight,
                  paddingInline: 10,
                  className: 'newsprint-track',
                  figures: [{ shape: 'circle', width: 86, height: 86, placement: 'bottom-center', linePadding: 10, content: <Placeholder className="np-placeholder-circle" /> }],
                },
              ]}
            />
          </article>

          <aside className="newsprint-rail">
            <PText
              as="h2"
              font={`500 30px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={31}
              className="newsprint-col-headline newsprint-col-headline-light"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "30px", lineHeight: "31px", fontWeight: 500 }}
            >
              Duis Aute Irure
            </PText>

            <Placeholder className="np-placeholder-sm" />

            <EditorialSurface
              text={rightRailText}
              font={font}
              lineHeight={lineHeight}
              minHeight={sideSurfaceHeight}
              lineRenderMode={lineRenderMode}
              prepareOptions={prepareOptions}
              className="newsprint-body"
              figures={[{ shape: 'rect', width: 140, height: 86, placement: 'center', linePadding: 10, content: <Placeholder /> }]}
            />
          </aside>
        </section>

        <div className="newsprint-rule" />

        <section className="newsprint-bottom-grid">
          <article className="newsprint-module">
            <PText
              as="h3"
              font={`800 20px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={21}
              className="newsprint-col-headline"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "20px", lineHeight: "21px", fontWeight: 800 }}
            >
              Tempor Incididunt
            </PText>
            <EditorialSurface text={bottomLeftText} font={font} lineHeight={lineHeight} minHeight={bottomSurfaceHeight} lineRenderMode={lineRenderMode} prepareOptions={prepareOptions} />
          </article>

          <article className="newsprint-module">
            <Placeholder className="np-placeholder-md" />
            <PText
              as="h3"
              font={`800 18px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={19}
              className="newsprint-col-headline"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "18px", lineHeight: "19px", fontWeight: 800 }}
            >
              Laboris Nisi
            </PText>
            <EditorialSurface text={bottomCenterText} font={font} lineHeight={lineHeight} minHeight={bottomSurfaceHeight} lineRenderMode={lineRenderMode} prepareOptions={prepareOptions} />
          </article>

          <article className="newsprint-module newsprint-module-wide">
            <Placeholder className="np-placeholder-wide" />
            <PText
              as="h3"
              font={`800 22px ${NEWSPRINT_FONT_FAMILY}`}
              lineHeight={23}
              className="newsprint-col-headline newsprint-col-headline-center"
              style={{ width: "100%", fontFamily: NEWSPRINT_FONT_FAMILY, fontSize: "22px", lineHeight: "23px", fontWeight: 800 }}
            >
              Aute Irure
            </PText>
            <EditorialColumns
              text={bottomWideText}
              font={font}
              lineHeight={lineHeight}
              gap={Math.max(12, gap - 4)}
              lineRenderMode={lineRenderMode}
              prepareOptions={prepareOptions}
              className="newsprint-columns"
              tracks={[
                { fr: 1, minHeight: bottomSurfaceHeight + 14, paddingInline: 8, className: 'newsprint-track' },
                {
                  fr: 1,
                  minHeight: bottomSurfaceHeight + 14,
                  paddingInline: 8,
                  className: 'newsprint-track',
                  figures: [{ shape: 'rect', width: 92, height: 72, placement: 'top-center', linePadding: 8, content: <Placeholder /> }],
                },
              ]}
            />
          </article>
        </section>
      </section>
    </main>
  );
}

export { EditorialPage };
