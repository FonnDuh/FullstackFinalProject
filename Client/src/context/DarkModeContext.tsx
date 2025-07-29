import React, {
  createContext,
  useState,
  useEffect,
  type FunctionComponent,
} from "react";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

export const DarkModeProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true" ||
      !localStorage.getItem("darkMode")
  );

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext };
