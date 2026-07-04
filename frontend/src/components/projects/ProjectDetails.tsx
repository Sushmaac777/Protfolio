import type { Project } from "../../types/project";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export function ProjectDetails({ project }: { project: Project }) {
  return (
    <section className="section">
      <div className="project-detail">
        <div className="project-detail__header">
          <Badge>{project.year}</Badge>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
        <div className="project-detail__body">
          <div className="card">
            <h2>Overview</h2>
            <p>{project.description}</p>
          </div>
          <div className="card">
            <h2>Stack</h2>
            <div className="badge-row">
              {project.stack.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
          <div className="card">
            <h2>Links</h2>
            <div className="button-row">
              {project.links.map((link) => (
                <Button href={link.url} key={link.label} variant="outline">
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

