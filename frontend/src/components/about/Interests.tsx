import { useContentValue } from "../../hooks/useContentValue";

export function Interests() {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">{copy.about.interestsEyebrow}</p>
        <h2>{copy.about.interestsTitle}</h2>
      </div>
      <div className="copy-grid">
        {copy.about.interestsItems.map((interest) => (
          <div className="note" key={interest}>
            <p>{interest}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
