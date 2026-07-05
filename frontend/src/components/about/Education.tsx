import { useContentValue } from "../../hooks/useContentValue";

export function Education() {
  const about = useContentValue("aboutPage");

  return (
    <section className="section education-journey">
      <div className="section-heading">
        <p className="eyebrow">{about.educationEyebrow}</p>
        <h2>{about.educationTitle}</h2>
        <p>{about.educationDescription}</p>
      </div>

      <div className="education-journey__grid">
        {about.educationJourney.map((entry) => (
          <article className="education-journey__card" key={`${entry.year}-${entry.stage}`}>
            <div className="education-journey__top">
              <span className="education-journey__year">{entry.year}</span>
              <span className="education-journey__outcome">{entry.outcome}</span>
            </div>

            <div className="education-journey__copy">
              <p className="education-journey__stage">{entry.stage}</p>
              <h3>{entry.institution}</h3>
              <p>{entry.detail}</p>
            </div>

            <div className="badge-row education-journey__badges">
              {entry.highlights.map((highlight) => (
                <span className="education-journey__badge" key={highlight}>
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
