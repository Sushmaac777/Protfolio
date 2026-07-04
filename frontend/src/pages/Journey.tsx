import { SectionTitle } from "../components/common/SectionTitle";
import { useContentValue } from "../hooks/useContentValue";

export function Journey() {
  const copy = useContentValue("siteCopy");
  const milestones = [...copy.journey.milestones].reverse();

  return (
    <div className="page">
      <section className="section">
        <SectionTitle
          eyebrow={copy.pages.journey.eyebrow}
          title={copy.pages.journey.title}
          description={copy.pages.journey.description}
        />

        <div className="journey-timeline">
          {milestones.map((milestone, index) => (
            <article className="journey-step" key={`${milestone.year}-${milestone.title}`}>
              <div className="journey-step__year">
                <span>{milestone.year}</span>
              </div>
              <div className="journey-step__dot" aria-hidden="true">
                <span />
              </div>
              <div className="journey-step__content">
                <p className="journey-step__count">{String(index + 1).padStart(2, "0")}</p>
                <h3>{milestone.title}</h3>
                <p>{milestone.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
