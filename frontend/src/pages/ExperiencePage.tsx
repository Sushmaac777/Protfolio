import { getExperience } from "../api/experience";
import { Loader } from "../components/common/Loader";
import { SectionTitle } from "../components/common/SectionTitle";
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
        <SectionTitle eyebrow={copy.pages.experience.eyebrow} title={copy.pages.experience.title} />
        <ExperienceTimeline experience={data} />
      </section>
    </div>
  );
}
