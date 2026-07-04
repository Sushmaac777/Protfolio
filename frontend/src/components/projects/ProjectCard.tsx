import { Link } from "react-router-dom";

import type { Project } from "../../types/project";
import { formatStack } from "../../utils/formatters";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="project-card">
      <div className="project-card__meta">
        <Badge>{project.year}</Badge>
        <span>{project.status}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <p className="muted">{formatStack(project.stack)}</p>
      <Link className="text-link" to={`/projects/${project.slug}`}>
        View details
      </Link>
    </Card>
  );
}

