import type { SkillCategory as SkillCategoryType } from "../../types/skill";
import { Card } from "../common/Card";
import { SkillBar } from "./SkillBar";

export function SkillCategory({ category }: { category: SkillCategoryType }) {
  return (
    <Card>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <div className="skill-stack">
        {category.items.map((skill) => (
          <SkillBar key={skill.name} skill={skill} />
        ))}
      </div>
    </Card>
  );
}

