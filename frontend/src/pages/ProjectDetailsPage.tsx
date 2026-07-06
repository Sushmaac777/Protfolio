import { useParams } from "react-router-dom";

import { getProjectBySlug } from "../api/projects";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { ProjectDetails } from "../components/projects/ProjectDetails";
import { useFetch } from "../hooks/useFetch";

export function ProjectDetailsPage() {
  const { slug = "" } = useParams();
  const { data: project, loading, error } = useFetch(() => getProjectBySlug(slug), [slug]);

  if (loading) {
    return <Loader label="Loading project" />;
  }

  if (error) {
    return (
      <div className="page">
        <EmptyState title="Could not load project" message="The project details could not be loaded from the backend." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <EmptyState title="Project not found" message="The project you requested does not exist." />
      </div>
    );
  }

  return (
    <div className="page">
      <ProjectDetails project={project} />
    </div>
  );
}
