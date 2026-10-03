import { createContext, useContext, useEffect, useState } from "react";

// =====================================
// CREATE CONTEXT
// =====================================

const ThemeContext = createContext(null);

// =====================================
// THEME PROVIDER
// =====================================

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("lavi_theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "light";
  });

  // ===================================
  // APPLY THEME
  // ===================================

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("lavi_theme", theme);
  }, [theme]);

  // ===================================
  // TOGGLE THEME
  // ===================================

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  // ===================================
  // SET SPECIFIC THEME
  // ===================================

  const changeTheme = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") {
      return;
    }

    setTheme(newTheme);
  };

  // ===================================
  // CONTEXT VALUE
  // ===================================

  const value = {
    theme,

    isDarkMode: theme === "dark",

    isLightMode: theme === "light",

    toggleTheme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// =====================================
// CUSTOM HOOK
// =====================================

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

export default ThemeContext;
