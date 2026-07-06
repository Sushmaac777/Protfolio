import { getSkills } from "../api/skills";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { SkillsPreview } from "../components/home/SkillsPreview";
import { useFetch } from "../hooks/useFetch";

export function SkillsPage() {
  const { data, loading, error } = useFetch(getSkills);

  if (loading) {
    return <Loader label="Loading skills" />;
  }

  if (error || !data) {
    return (
      <div className="page">
        <EmptyState title="Could not load skills" message="The skills data could not be loaded from the backend." />
      </div>
    );
  }

  return (
    <div className="page">
      <SkillsPreview skills={data} />
    </div>
  );
}
