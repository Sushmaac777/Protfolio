import { getExperience } from "../api/experience";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { ExperienceTimeline } from "../components/experience/Timeline";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function ExperiencePage() {
  const { data, loading, error } = useFetch(getExperience);
  const copy = useContentValue("siteCopy");

  if (loading) {
    return <Loader label="Loading experience" />;
  }

  if (error || !data) {
    return (
      <div className="page">
        <EmptyState title="Could not load experience" message="The experience timeline could not be loaded from the backend." />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-heading section-heading--experience-page">
          <h2 className="section-heading__inline-copy">{copy.pages.experience.title}</h2>
        </div>
        <ExperienceTimeline experience={data} />
      </section>
    </div>
  );
}
