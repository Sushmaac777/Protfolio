import { Button } from "../common/Button";
import { useContentValue } from "../../hooks/useContentValue";
import { AboutCurve, AboutIcon, aboutToneStyle } from "./AboutVisuals";

const stagePositions = [
  { left: "54%", top: "15%" },
  { left: "31%", top: "36%" },
  { left: "7%", top: "57%" },
  { left: "9%", top: "78%" },
];

export function AboutHero() {
  const about = useContentValue("aboutPage");

  return (
    <section className="section about-hero-panel">
      <div className="about-hero-panel__layout">
        <div className="about-hero-panel__copy">
          <div className="about-hero-panel__pill">
            <span className="about-hero-panel__pill-icon" aria-hidden="true">
              <AboutIcon name="user" />
            </span>
            <span>{about.heroEyebrow}</span>
          </div>

          <h1 className="about-hero-panel__title">
            <span>{about.heroTitleLead}</span>
            <span className="about-hero-panel__accent">{about.heroTitleAccent}</span>
          </h1>

          <div className="about-hero-panel__text">
            {about.heroParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="button-row about-hero-panel__actions">
            <Button className="about-hero-panel__primary" to="/journey">
              Explore My Journey <span aria-hidden="true">→</span>
            </Button>
            <Button className="about-hero-panel__secondary" to="/research" variant="outline">
              Research <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>

        <div className="about-hero-panel__visual">
          <img
            alt=""
            aria-hidden="true"
            className="about-hero-panel__reference-image"
            draggable={false}
            src="/about/about-scene-clean.png"
          />
          <AboutCurve className="about-hero-panel__curve" />

          {about.heroPathway.map((item, index) => (
            <article
              className="about-hero-panel__stage"
              key={item.title}
              style={{
                ...aboutToneStyle(item.tone),
                left: stagePositions[index]?.left,
                top: stagePositions[index]?.top,
              }}
            >
              <div className="about-hero-panel__stage-icon">
                <AboutIcon name={item.icon} />
              </div>
              <div className="about-hero-panel__stage-copy">
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
