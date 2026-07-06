import type { PortfolioContentKey, PortfolioContentMap } from "../types/content";
import api from "./axios";

export type SharedContentMap = Pick<PortfolioContentMap, "aboutPage" | "achievements" | "siteCopy">;
const contentApiBaseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getSharedContent(): Promise<SharedContentMap> {
  const response = await api.get<SharedContentMap>("/content");
  return response.data;
}

export function getContentStreamUrl(): string {
  return `${contentApiBaseUrl}/content/stream`;
}

export async function getAdminContent(token: string): Promise<PortfolioContentMap> {
  const response = await api.get<PortfolioContentMap>("/admin/content", authHeaders(token));
  return response.data;
}

export async function updateAdminContentSection<K extends PortfolioContentKey>(
  token: string,
  section: K,
  value: PortfolioContentMap[K],
): Promise<PortfolioContentMap[K]> {
  const response = await api.put<PortfolioContentMap[K]>(`/admin/content/${section}`, value, authHeaders(token));
  return response.data;
}

export async function resetAdminContentSection<K extends PortfolioContentKey>(
  token: string,
  section: K,
): Promise<PortfolioContentMap[K]> {
  const response = await api.post<PortfolioContentMap[K]>(`/admin/content/${section}/reset`, {}, authHeaders(token));
  return response.data;
}

export async function resetAllAdminContent(token: string): Promise<PortfolioContentMap> {
  const response = await api.post<PortfolioContentMap>("/admin/content/reset-all", {}, authHeaders(token));
  return response.data;
}
