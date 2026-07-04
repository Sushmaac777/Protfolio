import { mockProjects } from "../data/mockPortfolio";
import type { Project } from "../types/project";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getProjects(options?: { featured?: boolean }): Promise<Project[]> {
  const override = readContentOverride("projects");
  if (override) {
    return options?.featured ? override.filter((project) => project.featured) : override;
  }

  try {
    const response = await api.get<Project[]>("/projects", { params: options });
    return response.data;
  } catch {
    return options?.featured ? mockProjects.filter((project) => project.featured) : mockProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const override = readContentOverride("projects");
  if (override) {
    return override.find((project) => project.slug === slug);
  }

  try {
    const response = await api.get<Project>(`/projects/${slug}`);
    return response.data;
  } catch {
    return mockProjects.find((project) => project.slug === slug);
  }
}
