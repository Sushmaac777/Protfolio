import type { SkillCategory } from "../types/skill";
import api from "./axios";

export async function getSkills(): Promise<SkillCategory[]> {
  const response = await api.get<SkillCategory[]>("/skills");
  return response.data;
}
