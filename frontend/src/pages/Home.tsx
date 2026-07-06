import { getExperience } from "../api/experience";
import { getProjects } from "../api/projects";
import { getProfile } from "../api/profile";
import { getPublications } from "../api/publications";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { Hero } from "../components/home/Hero";
import { QuickHighlights } from "../components/home/QuickHighlights";
import { WhatIDo } from "../components/home/WhatIDo";
import { useFetch } from "../hooks/useFetch";

export function Home() {
  const profile = useFetch(getProfile);
  const projects = useFetch(getProjects);
  const publications = useFetch(getPublications);
  const experience = useFetch(getExperience);

  if (profile.loading || projects.loading || publications.loading || experience.loading) {
    return <Loader label="Loading portfolio" />;
  }

  if (profile.error || projects.error || publications.error || experience.error || !profile.data || !projects.data || !publications.data || !experience.data) {
    return (
      <div className="page">
        <EmptyState
          title="Could not load portfolio"
          message="The homepage content could not be loaded from the backend right now."
        />
      </div>
    );
  }

  return (
    <div className="page landing-page">
      <Hero profile={profile.data} />
      <QuickHighlights experience={experience.data} projects={projects.data} publications={publications.data} />
      <WhatIDo />
    </div>
  );
}
