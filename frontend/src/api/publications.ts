import { mockPublications } from "../data/mockPortfolio";
import type { Publication } from "../types/publication";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getPublications(): Promise<Publication[]> {
  const override = readContentOverride("publications");
  if (override) {
    return override;
  }

  try {
    const response = await api.get<Publication[]>("/publications");
    return response.data;
  } catch {
    return mockPublications;
  }
}
