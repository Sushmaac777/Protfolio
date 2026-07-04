import { getPublications } from "../api/publications";
import { Loader } from "../components/common/Loader";
import { SectionTitle } from "../components/common/SectionTitle";
import { PublicationList } from "../components/publications/PublicationList";
import { useContentValue } from "../hooks/useContentValue";
import { useFetch } from "../hooks/useFetch";

export function Publications() {
  const { data, loading } = useFetch(getPublications);
  const copy = useContentValue("siteCopy");

  if (loading || !data) {
    return <Loader label="Loading publications" />;
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
