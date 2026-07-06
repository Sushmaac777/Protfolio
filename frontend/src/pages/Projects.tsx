import { useDeferredValue, useMemo, useState } from "react";

import { getProjects } from "../api/projects";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { Filter } from "../components/projects/Filter";
import { ProjectGrid } from "../components/projects/ProjectGrid";
import { useContentValue } from "../hooks/useContentValue";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import { uniqueTags } from "../utils/helpers";

export function Projects() {
  const { data: projects, loading, error } = useFetch(getProjects);
  const copy = useContentValue("siteCopy");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const debouncedQuery = useDebounce(query, 150);
  const deferredQuery = useDeferredValue(debouncedQuery);

  const tags = useMemo(() => (projects ? uniqueTags(projects) : []), [projects]);
  const filteredProjects = useMemo(() => {
    if (!projects) {
      return [];
    }

    return projects.filter((project) => {
      const matchesQuery =
        project.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        project.stack.join(" ").toLowerCase().includes(deferredQuery.toLowerCase());
      const matchesTag = !activeTag || project.stack.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [activeTag, deferredQuery, projects]);

  if (loading) {
    return <Loader label="Loading projects" />;
  }

  if (error || !projects) {
    return (
      <div className="page">
        <EmptyState title="Could not load projects" message="The projects list could not be loaded from the backend." />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-heading section-heading--projects-page">
          <h2 className="section-heading__inline-copy">{copy.pages.projects.title}</h2>
          <p>{copy.pages.projects.description}</p>
        </div>
        <Filter
          activeTag={activeTag}
          onQueryChange={setQuery}
          onTagChange={setActiveTag}
          query={query}
          tags={tags}
        />
        <ProjectGrid projects={filteredProjects} />
      </section>
    </div>
  );
}
