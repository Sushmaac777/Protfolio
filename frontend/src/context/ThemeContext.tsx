import { createContext, type ReactNode, useEffect } from "react";

export type Theme = "sunrise" | "night";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "sunrise";

    if (typeof window !== "undefined") {
      window.localStorage.setItem("portfolio-theme", "sunrise");
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: "sunrise",
        toggleTheme: () => undefined,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
