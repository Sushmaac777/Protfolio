import type { SkillCategory } from "../../types/skill";
import { useContentValue } from "../../hooks/useContentValue";
import { SectionTitle } from "../common/SectionTitle";

export function SkillsPreview({ skills }: { skills: SkillCategory[] }) {
  const copy = useContentValue("siteCopy");

  return (
    <section className="section skills-preview">
      <SectionTitle
        eyebrow={copy.home.skillsEyebrow}
        title={copy.home.skillsTitle}
        description={copy.home.skillsDescription}
      />
      <div className="grid grid--three">
        {skills.map((category) => (
          <div className="card card--soft" key={category.name}>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <ul className="stack-list">
              {category.items.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.level}%</strong>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
