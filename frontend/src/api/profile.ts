import type { Profile } from "../types/profile";
import api from "./axios";

export async function getProfile(): Promise<Profile> {
  const response = await api.get<Profile>("/profile");
  return response.data;
}
