import { useContentValue } from "../../hooks/useContentValue";
import { SectionTitle } from "../common/SectionTitle";

export function Education() {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section">
      <SectionTitle eyebrow={copy.about.educationEyebrow} title={copy.about.educationTitle} />
      <div className="grid">
        {copy.about.educationItems.map((entry) => (
          <div className="card" key={entry.institution}>
            <h3>{entry.institution}</h3>
            <p>{entry.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
