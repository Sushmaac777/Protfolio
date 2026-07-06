import type { Publication } from "../types/publication";
import api from "./axios";

export async function getPublications(): Promise<Publication[]> {
  const response = await api.get<Publication[]>("/publications");
  return response.data;
}
