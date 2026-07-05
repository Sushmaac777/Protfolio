import { useContentValue } from "../../hooks/useContentValue";
import { AboutIcon, aboutToneStyle } from "./AboutVisuals";

export function AboutNext() {
  const about = useContentValue("aboutPage");

  return (
    <section className="about-subsection">
      <div className="about-page-heading about-page-heading--center about-page-heading--compact">
        <h2>{about.nextTitle}</h2>
      </div>

      <div className="about-next-grid">
        {about.nextSteps.map((item) => (
          <article className="about-next-card" key={item.title} style={aboutToneStyle(item.tone)}>
            <div className="about-next-card__arrow" aria-hidden="true">
              ↗
            </div>
            <div className="about-next-card__icon">
              <AboutIcon name={item.icon} />
            </div>
            <div className="about-next-card__copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
