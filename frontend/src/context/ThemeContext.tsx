import { createContext, type ReactNode, useLayoutEffect, useState } from "react";

export type Theme = "sunrise" | "night";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "sunrise";
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme === "night" ? "night" : "sunrise";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((current) => (current === "sunrise" ? "night" : "sunrise")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
