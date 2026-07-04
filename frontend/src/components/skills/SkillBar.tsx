import type { Skill } from "../../types/skill";

export function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="skill-bar">
      <div className="skill-bar__label">
        <span>{skill.name}</span>
        <strong>{skill.level}%</strong>
      </div>
      <div className="skill-bar__track">
        <span className="skill-bar__fill" style={{ width: `${skill.level}%` }} />
      </div>
    </div>
  );
}

