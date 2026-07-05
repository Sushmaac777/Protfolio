import { useContentValue } from "../../hooks/useContentValue";

export function SkillsPanel() {
  const about = useContentValue("aboutPage");

  return (
    <section className="section about-skills">
      <div className="section-heading">
        <p className="eyebrow">{about.skillsEyebrow}</p>
        <h2>{about.skillsTitle}</h2>
        <p>{about.skillsDescription}</p>
      </div>

      <div className="about-skills__grid">
        {about.skillGroups.map((group) => (
          <article className="about-skills__card" key={group.title}>
            <div className="about-skills__card-head">
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>

            <div className="about-skills__chips">
              {group.items.map((item) => (
                <span className="about-skills__chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
