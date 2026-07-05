import { useContentValue } from "../../hooks/useContentValue";
import { AboutIcon, aboutToneStyle } from "./AboutVisuals";

export function AboutJourney() {
  const about = useContentValue("aboutPage");

  return (
    <section className="about-journey-panel">
      <div className="about-page-heading about-page-heading--center">
        <h2>{about.educationTitle}</h2>
        <p>{about.educationDescription}</p>
      </div>

      <div className="about-journey-panel__track" aria-hidden="true">
        {about.educationJourney.map((entry) => (
          <span className="about-journey-panel__marker" key={entry.year} style={aboutToneStyle(entry.tone)} />
        ))}
      </div>

      <div className="about-journey-panel__grid">
        {about.educationJourney.map((entry) => (
          <article className="about-journey-card" key={`${entry.year}-${entry.outcome}`} style={aboutToneStyle(entry.tone)}>
            <span className="about-journey-card__year">{entry.year}</span>

            <div className="about-journey-card__icon">
              <AboutIcon name={entry.icon} />
            </div>

            <div className="about-journey-card__copy">
              <h3>{entry.outcome}</h3>
              <p className="about-journey-card__stage">{entry.stage}</p>
              <p className="about-journey-card__institution">{entry.institution}</p>
              <p className="about-journey-card__detail">{entry.detail}</p>
            </div>

            <div className="about-journey-card__badges">
              {entry.highlights.map((highlight) => (
                <span className="about-journey-card__badge" key={highlight}>
                  {highlight}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
