import axios from "axios";
import type { Project } from "../types/project";
import api from "./axios";

export async function getProjects(options?: { featured?: boolean }): Promise<Project[]> {
  const response = await api.get<Project[]>("/projects", { params: options });
  return response.data;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const response = await api.get<Project>(`/projects/${slug}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return undefined;
    }

    throw error;
  }
}
