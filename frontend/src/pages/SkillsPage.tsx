import { getSkills } from "../api/skills";
import { Loader } from "../components/common/Loader";
import { SkillsPreview } from "../components/home/SkillsPreview";
import { useFetch } from "../hooks/useFetch";

export function SkillsPage() {
  const { data, loading } = useFetch(getSkills);

  if (loading || !data) {
    return <Loader label="Loading skills" />;
  }

  return (
    <div className="page">
      <SkillsPreview skills={data} />
    </div>
  );
}
