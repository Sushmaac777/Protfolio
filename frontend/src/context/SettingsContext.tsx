import { createContext, type ReactNode, useContext } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";

type SettingsContextValue = {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useLocalStorage("portfolio-reduced-motion", false);

  return (
    <SettingsContext.Provider
      value={{
        reducedMotion,
        toggleReducedMotion: () => setReducedMotion((value) => !value),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }
  return context;
}
