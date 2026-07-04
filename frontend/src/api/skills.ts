import { mockSkills } from "../data/mockPortfolio";
import type { SkillCategory } from "../types/skill";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getSkills(): Promise<SkillCategory[]> {
  const override = readContentOverride("skills");
  if (override) {
    return override;
  }

  try {
    const response = await api.get<SkillCategory[]>("/skills");
    return response.data;
  } catch {
    return mockSkills;
  }
}
