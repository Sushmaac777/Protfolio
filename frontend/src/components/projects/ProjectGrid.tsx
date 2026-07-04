import type { Project } from "../../types/project";
import { EmptyState } from "../common/EmptyState";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return <EmptyState title="No projects found" message="Try changing the filter or search term." />;
  }

  return (
    <div className="grid grid--cards">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

