import type { Publication } from "../../types/publication";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <Card>
      <div className="project-card__meta">
        <Badge>{publication.year}</Badge>
        <span>{publication.venue}</span>
      </div>
      <h3>{publication.title}</h3>
      <p>{publication.abstract}</p>
      <div className="badge-row">
        {publication.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <a className="text-link" href={publication.link} target="_blank" rel="noreferrer">
        Read publication
      </a>
    </Card>
  );
}

