import { useParams } from "react-router-dom";

import { getProjectBySlug } from "../api/projects";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { ProjectDetails } from "../components/projects/ProjectDetails";
import { useFetch } from "../hooks/useFetch";

export function ProjectDetailsPage() {
  const { slug = "" } = useParams();
  const { data: project, loading } = useFetch(() => getProjectBySlug(slug), [slug]);

  if (loading) {
    return <Loader label="Loading project" />;
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

