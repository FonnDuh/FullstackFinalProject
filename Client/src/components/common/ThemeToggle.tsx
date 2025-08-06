import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useDarkMode } from "../../hooks/useDarkMode";
import { Sun, Moon, Monitor } from "lucide-react";
import "./ThemeToggle.css";
import type { ThemeMode } from "../../context/DarkModeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useDarkMode();

  return (
    <div className="themeToggleWrapper">
      <label className="themeToggleLabel" htmlFor="theme-toggle-group">
        Theme
      </label>
      <ToggleGroup.Root
        id="theme-toggle-group"
        type="single"
        value={theme}
        onValueChange={(val: ThemeMode) => val && setTheme(val)}
        className="themeToggle">
        <ToggleGroup.Item
          value="auto"
          className="themeBtn"
          aria-label="Auto theme">
          <Monitor size={24} className="themeIcon" />
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="light"
          className="themeBtn"
          aria-label="Light theme">
          <Sun size={24} className="themeIcon" />
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="dark"
          className="themeBtn"
          aria-label="Dark theme">
          <Moon size={24} className="themeIcon" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );

}
