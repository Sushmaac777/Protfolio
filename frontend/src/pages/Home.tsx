import { getExperience } from "../api/experience";
import { getProjects } from "../api/projects";
import { getProfile } from "../api/profile";
import { getPublications } from "../api/publications";
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

  if (!profile.data || !projects.data || !publications.data || !experience.data) {
    return <Loader label="Loading portfolio" />;
  }

  return (
    <div className="page landing-page">
      <Hero profile={profile.data} />
      <QuickHighlights experience={experience.data} projects={projects.data} publications={publications.data} />
      <WhatIDo />
    </div>
  );
}
