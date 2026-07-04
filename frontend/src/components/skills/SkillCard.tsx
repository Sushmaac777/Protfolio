import type { Skill } from "../../types/skill";
import { SkillBar } from "./SkillBar";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="card card--soft">
      <SkillBar skill={skill} />
    </div>
  );
}

