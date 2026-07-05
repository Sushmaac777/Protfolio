import { useContentValue } from "../../hooks/useContentValue";
import { AboutIcon, aboutToneStyle } from "./AboutVisuals";

export function AboutCapabilities() {
  const about = useContentValue("aboutPage");

  return (
    <section className="about-capabilities-grid">
      {about.skillGroups.map((group) => (
        <article className="about-capabilities-card" key={group.title} style={aboutToneStyle(group.tone)}>
          <div className="about-capabilities-card__head">
            <div className="about-capabilities-card__icon">
              <AboutIcon name={group.icon} />
            </div>
            <div className="about-capabilities-card__title">
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>
          </div>

          <div className="about-capabilities-card__chips">
            {group.items.map((item) => (
              <span className="about-capabilities-card__chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
