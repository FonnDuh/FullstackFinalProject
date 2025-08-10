import { createContext } from "react";

export type ThemeMode = "auto" | "light" | "dark";

interface DarkModeContextProps {
  isDarkMode: boolean;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);
