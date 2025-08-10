import {
  useEffect,
  useState,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { DarkModeContext, type ThemeMode } from "../context/DarkModeContext";

const computeIsDark = (mode: ThemeMode) => {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return mode === "auto" ? systemDark : mode === "dark";
};

export const DarkModeProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(
    (localStorage.getItem("theme") as ThemeMode) || "auto"
  );

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem("theme", mode);
  };

  useEffect(() => {
    const dark = computeIsDark(theme);
    document.body.classList.toggle("dark-mode", dark);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        document.body.classList.toggle("dark-mode", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode: computeIsDark(theme), theme, setTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};
