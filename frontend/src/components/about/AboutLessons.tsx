import { useContentValue } from "../../hooks/useContentValue";
import { AboutIcon, aboutToneStyle } from "./AboutVisuals";

export function AboutLessons() {
  const about = useContentValue("aboutPage");

  return (
    <section className="about-subsection">
      <div className="about-page-heading about-page-heading--center about-page-heading--compact">
        <h2>{about.lessonTitle}</h2>
      </div>

      <div className="about-lessons-grid">
        {about.lessonItems.map((item) => (
          <article className="about-lesson-card" key={item.title} style={aboutToneStyle(item.tone)}>
            <div className="about-lesson-card__icon">
              <AboutIcon name={item.icon} />
            </div>
            <div className="about-lesson-card__copy">
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
