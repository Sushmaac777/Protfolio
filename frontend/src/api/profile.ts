import { mockProfile } from "../data/mockPortfolio";
import type { Profile } from "../types/profile";
import { readContentOverride } from "../utils/contentOverrides";
import api from "./axios";

export async function getProfile(): Promise<Profile> {
  const override = readContentOverride("profile");
  if (override) {
    return override;
  }

  try {
    const response = await api.get<Profile>("/profile");
    return response.data;
  } catch {
    return mockProfile;
  }
}
