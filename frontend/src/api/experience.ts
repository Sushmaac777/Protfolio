import type { Experience } from "../types/experience";
import api from "./axios";

export async function getExperience(): Promise<Experience[]> {
  const response = await api.get<Experience[]>("/experience");
  return response.data;
}
