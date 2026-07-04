import { mockExperience } from "../data/mockPortfolio";
import type { Experience } from "../types/experience";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getExperience(): Promise<Experience[]> {
  const override = readContentOverride("experience");
  if (override) {
    return override;
  }

  try {
    const response = await api.get<Experience[]>("/experience");
    return response.data;
  } catch {
    return mockExperience;
  }
}
