import { getPublications } from "../api/publications";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { SectionTitle } from "../components/common/SectionTitle";
import { PublicationList } from "../components/publications/PublicationList";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function Publications() {
  const { data, loading, error } = useFetch(getPublications);
  const copy = useContentValue("siteCopy");

  if (loading) {
    return <Loader label="Loading publications" />;
  }

  if (error || !data) {
    return (
      <div className="page">
        <EmptyState title="Could not load publications" message="The research and publications data could not be loaded from the backend." />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <SectionTitle eyebrow={copy.pages.publications.eyebrow} title={copy.pages.publications.title} />
        <PublicationList publications={data} />
      </section>
    </div>
  );
}
