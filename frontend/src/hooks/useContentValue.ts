import { useSharedContentValue } from "../context/ContentContext";
import type { AchievementsContent, AboutPageContent, SiteCopy } from "../types/content";

type SharedContentMap = {
  aboutPage: AboutPageContent;
  achievements: AchievementsContent;
  siteCopy: SiteCopy;
};

export function useContentValue<K extends keyof SharedContentMap>(key: K): SharedContentMap[K] {
  return useSharedContentValue(key);
}
