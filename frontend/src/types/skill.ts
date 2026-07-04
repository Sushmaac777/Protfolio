export type Skill = {
  name: string;
  level: number;
};

export type SkillCategory = {
  name: string;
  description: string;
  items: Skill[];
};

