import { useSyncExternalStore } from "react";

import type { PortfolioContentKey, PortfolioContentMap } from "../types/content";
import {
  getContentOverridesSnapshot,
  getContentValue,
  subscribeToContentOverrides,
} from "../utils/contentOverrides";

export function useContentValue<K extends PortfolioContentKey>(key: K): PortfolioContentMap[K] {
  useSyncExternalStore(subscribeToContentOverrides, getContentOverridesSnapshot, getContentOverridesSnapshot);
  return getContentValue(key);
}
