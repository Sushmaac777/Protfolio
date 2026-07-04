import type { Experience } from "../../types/experience";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card>
      <div className="project-card__meta">
        <Badge>{experience.period}</Badge>
      </div>
      <h3>
        {experience.role} · {experience.company}
      </h3>
      <p>{experience.summary}</p>
      <ul className="bullet-list">
        {experience.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="badge-row">
        {experience.technologies.map((technology) => (
          <Badge key={technology}>{technology}</Badge>
        ))}
      </div>
    </Card>
  );
}

