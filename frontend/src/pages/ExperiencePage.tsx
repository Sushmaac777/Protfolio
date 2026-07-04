import { getExperience } from "../api/experience";
import { Loader } from "../components/common/Loader";
import { ExperienceTimeline } from "../components/experience/Timeline";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function ExperiencePage() {
  const { data, loading } = useFetch(getExperience);
  const copy = useContentValue("siteCopy");

  if (loading || !data) {
    return <Loader label="Loading experience" />;
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
