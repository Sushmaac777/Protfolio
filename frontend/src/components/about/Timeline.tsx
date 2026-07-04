import type { Experience } from "../../types/experience";
import { useContentValue } from "../../hooks/useContentValue";
import { SectionTitle } from "../common/SectionTitle";

export function AboutTimeline({ experience }: { experience: Experience[] }) {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section">
      <SectionTitle eyebrow={copy.about.timelineEyebrow} title={copy.about.timelineTitle} />
      <div className="timeline">
        {experience.map((item) => (
          <div className="timeline__item" key={`${item.company}-${item.role}`}>
            <p className="timeline__period">{item.period}</p>
            <h3>
              {item.role} · {item.company}
            </h3>
            <p>{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
