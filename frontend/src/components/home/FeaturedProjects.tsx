import type { Project } from "../../types/project";
import { useContentValue } from "../../hooks/useContentValue";
import { SectionTitle } from "../common/SectionTitle";
import { ProjectGrid } from "../projects/ProjectGrid";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section featured-projects">
      <SectionTitle
        eyebrow={copy.home.featuredEyebrow}
        title={copy.home.featuredTitle}
        description={copy.home.featuredDescription}
      />
      <ProjectGrid projects={projects} />
    </section>
  );
}
