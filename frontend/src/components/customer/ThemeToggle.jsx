import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = ({ showLabel = false, className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500 ${showLabel ? "px-3 py-2" : "h-10 w-10"} ${className}`}
    >
      {isDarkMode ? (
        <FiSun size={18} className="shrink-0" />
      ) : (
        <FiMoon size={18} className="shrink-0" />
      )}

      {showLabel && (
        <span className="text-sm font-medium">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
