import { achievements } from "../data/achievements";
import { mockBlogs, mockExperience, mockProfile, mockProjects, mockPublications, mockSkills } from "../data/mockPortfolio";
import { siteCopy } from "../data/siteCopy";
import type { PortfolioContentKey, PortfolioContentMap } from "../types/content";

const STORAGE_KEY = "portfolio-content-overrides";
const CHANGE_EVENT = "portfolio-content-overrides-change";
const listeners = new Set<() => void>();

const defaultContent: PortfolioContentMap = {
  profile: mockProfile,
  projects: mockProjects,
  publications: mockPublications,
  experience: mockExperience,
  skills: mockSkills,
  blogs: mockBlogs,
  achievements,
  siteCopy,
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, override: unknown): T {
  if (Array.isArray(defaults) && Array.isArray(override)) {
    return override.map((item, index) => {
      const defaultItem = defaults[index];

      if (isPlainObject(defaultItem) && isPlainObject(item)) {
        return mergeWithDefaults(defaultItem, item);
      }

      return item;
    }) as T;
  }

  if (isPlainObject(defaults) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...defaults };

    Object.entries(override).forEach(([key, value]) => {
      if (key in result) {
        result[key] = mergeWithDefaults(result[key], value);
      } else {
        result[key] = value;
      }
    });

    return result as T;
  }

  return override === undefined ? defaults : (override as T);
}

function readAllOverrides(): Partial<PortfolioContentMap> {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as Partial<PortfolioContentMap>) : {};
  } catch {
    return {};
  }
}

function writeAllOverrides(overrides: Partial<PortfolioContentMap>) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function notifyContentOverridesChanged() {
  listeners.forEach((listener) => listener());
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) {
    return;
  }

  notifyContentOverridesChanged();
}

function handleOverridesChangedEvent() {
  notifyContentOverridesChanged();
}

function dispatchOverridesChanged() {
  if (typeof window === "undefined") {
    notifyContentOverridesChanged();
    return;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getDefaultContent<K extends PortfolioContentKey>(key: K): PortfolioContentMap[K] {
  return cloneValue(defaultContent[key]);
}

export function getContentValue<K extends PortfolioContentKey>(key: K): PortfolioContentMap[K] {
  const override = readContentOverride(key);

  if (!override) {
    return getDefaultContent(key);
  }

  if (key === "siteCopy") {
    return mergeWithDefaults(getDefaultContent(key), override) as PortfolioContentMap[K];
  }

  return override;
}

export function readContentOverride<K extends PortfolioContentKey>(key: K): PortfolioContentMap[K] | null {
  const overrides = readAllOverrides();
  const value = overrides[key];
  return value ? cloneValue(value as PortfolioContentMap[K]) : null;
}

export function writeContentOverride<K extends PortfolioContentKey>(key: K, value: PortfolioContentMap[K]) {
  const overrides = readAllOverrides();
  overrides[key] = cloneValue(value);
  writeAllOverrides(overrides);
  dispatchOverridesChanged();
}

export function removeContentOverride(key: PortfolioContentKey) {
  const overrides = readAllOverrides();
  delete overrides[key];
  writeAllOverrides(overrides);
  dispatchOverridesChanged();
}

export function clearContentOverrides() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  dispatchOverridesChanged();
}

export function getContentOverridesSnapshot() {
  if (!canUseStorage()) {
    return "";
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function subscribeToContentOverrides(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(CHANGE_EVENT, handleOverridesChangedEvent);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(CHANGE_EVENT, handleOverridesChangedEvent);
    }
  };
}
